"""
losses.py
=========
Topology-aware loss functions for occlusion-robust road segmentation.

WHY THIS EXISTS (see research doc: "mathematical formulation and PyTorch code
logic for topological loss functions"):
    Standard pixel-wise losses (Cross-Entropy, plain Dice) are area-weighted.
    A 1-pixel gap in a thin road caused by a tree canopy is a negligible
    fraction of total road AREA, so the network is barely penalized for it,
    even though that gap destroys the road's TOPOLOGY (connectivity).

    clDice fixes this by scoring precision/sensitivity on the *skeleton*
    (centerline) of the mask rather than the raw area, so a broken pixel in
    a critical link produces a huge relative penalty.

    Because raw morphological skeletonization (Zhang-Suen etc.) is a
    discrete / non-differentiable operation, we cannot backprop through it.
    Shit et al.'s soft-skeletonization approximates erosion/dilation with
    differentiable min/max-pooling so the whole pipeline stays trainable.

This module implements, exactly as specified in the research:
    1. SoftSkeleton2D      -> differentiable soft-skeletonization S~(.)
    2. SoftDiceclDiceLoss  -> L_total = (1-alpha)*L_soft-Dice + alpha*L_soft-clDice
"""

import torch
import torch.nn as nn
import torch.nn.functional as F


class SoftSkeleton2D(nn.Module):
    """
    Differentiable 2D Morphological Soft-Skeletonization.

    Approximates morphological thinning using iterative soft-erosion /
    soft-opening (top-hat transform) built entirely from differentiable
    min/max-pooling operations, so gradients can flow back to the
    segmentation network during training.
    """

    def __init__(self, num_iterations: int = 3):
        """
        Args:
            num_iterations: Number of erosion iterations (k). This should
                roughly correspond to the maximum expected road *radius* in
                pixels at your training resolution -- too small and thick
                roads won't be fully skeletonized; too large adds needless
                compute.
        """
        super().__init__()
        self.num_iterations = num_iterations

    def soft_erode(self, x: torch.Tensor) -> torch.Tensor:
        """
        soft_erode(I) = -maxpool(-I)

        In 2D, a single 3x3 pooling kernel over-erodes thin (1-2px) linear
        structures like road centerlines. Per the research spec, the 2D
        structuring element is decoupled into a (3,1) vertical strip and a
        (1,3) horizontal strip, and the erosion is the pixel-wise MIN of the
        two -- this preserves thin diagonal/near-axis-aligned lines that a
        naive 3x3 erosion would erase.
        """
        p_horiz = -F.max_pool2d(-x, kernel_size=(3, 1), stride=1, padding=(1, 0))
        p_vert = -F.max_pool2d(-x, kernel_size=(1, 3), stride=1, padding=(0, 1))
        return torch.min(p_horiz, p_vert)

    def soft_dilate(self, x: torch.Tensor) -> torch.Tensor:
        """soft_dilate(I) = maxpool2d(I, kernel=3x3) -- standard dilation proxy."""
        return F.max_pool2d(x, kernel_size=(3, 3), stride=1, padding=(1, 1))

    def soft_open(self, x: torch.Tensor) -> torch.Tensor:
        """soft_open(I) = soft_dilate(soft_erode(I))"""
        return self.soft_dilate(self.soft_erode(x))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Iterative soft-skeleton extraction (top-hat accumulation).

        S(0) = ReLU(I(0) - soft_open(I(0)))                 # thinnest structures
        for i in 1..k:
            I(i)  = soft_erode(I(i-1))
            delta = ReLU(I(i) - soft_open(I(i)))
            S(i)  = S(i-1) + (1 - S(i-1)) * delta            # accumulate, no double count
        S = S(k)
        """
        x_open = self.soft_open(x)
        skel = F.relu(x - x_open)  # S(0): top-hat transform captures thinnest structures

        for _ in range(self.num_iterations):
            x = self.soft_erode(x)
            x_open = self.soft_open(x)
            delta = F.relu(x - x_open)
            # S(i) = S(i-1) + (1 - S(i-1)) * delta  -- implemented as the
            # algebraically equivalent, numerically stable form below.
            skel = skel + F.relu(delta - skel * delta)

        return skel


class SoftDiceclDiceLoss(nn.Module):
    """
    Hybrid loss: L_total = (1 - alpha) * L_soft-Dice + alpha * L_soft-clDice

    - Soft-Dice regularizes AREA/volume alignment (prevents the topology term
      from producing wildly over-segmented, too-wide roads).
    - Soft-clDice regularizes TOPOLOGY/connectivity (heavily penalizes any
      break in the road centerline caused by occlusion).

    alpha in [0, 0.5]; the research notes alpha=0.5 empirically gives the
    strongest topological continuity while soft-Dice still keeps geometry
    sane.
    """

    def __init__(self, alpha: float = 0.5, num_iterations: int = 3, smooth: float = 1.0):
        super().__init__()
        assert 0.0 <= alpha <= 0.5, "alpha should be in [0, 0.5] per the research spec"
        self.alpha = alpha
        self.smooth = smooth
        self.soft_skeleton = SoftSkeleton2D(num_iterations=num_iterations)

    def soft_dice_loss(self, y_pred: torch.Tensor, y_true: torch.Tensor) -> torch.Tensor:
        """L_soft-Dice = 1 - (2*|P n G| + eps) / (|P| + |G| + eps)"""
        intersection = torch.sum(y_pred * y_true, dim=(-2, -1))
        denominator = torch.sum(y_pred, dim=(-2, -1)) + torch.sum(y_true, dim=(-2, -1))
        dice_score = (2.0 * intersection + self.smooth) / (denominator + self.smooth)
        return 1.0 - torch.mean(dice_score)

    def soft_cldice_loss(self, y_pred: torch.Tensor, y_true: torch.Tensor) -> torch.Tensor:
        """
        soft-clDice = 1 - harmonic_mean(T_prec, T_sens)

        T_prec = (sum(skel_pred * y_true) + eps) / (sum(skel_pred) + eps)
                 -> fraction of predicted centerline that lies on real road
                    (penalizes "ghost" false-positive roads)
        T_sens = (sum(skel_true * y_pred) + eps) / (sum(skel_true) + eps)
                 -> fraction of the TRUE centerline recovered by the
                    prediction (penalizes broken/missed segments -- this is
                    the term that specifically fixes occlusion gaps, since
                    the denominator is only the thin skeleton, so a single
                    broken pixel is a huge relative loss)
        """
        skel_pred = self.soft_skeleton(y_pred)
        skel_true = self.soft_skeleton(y_true)

        t_prec_num = torch.sum(skel_pred * y_true, dim=(-2, -1)) + self.smooth
        t_prec_den = torch.sum(skel_pred, dim=(-2, -1)) + self.smooth
        t_prec = t_prec_num / t_prec_den

        t_sens_num = torch.sum(skel_true * y_pred, dim=(-2, -1)) + self.smooth
        t_sens_den = torch.sum(skel_true, dim=(-2, -1)) + self.smooth
        t_sens = t_sens_num / t_sens_den

        cldice_score = (2.0 * t_prec * t_sens) / (t_prec + t_sens)
        return 1.0 - torch.mean(cldice_score)

    def forward(self, y_pred: torch.Tensor, y_true: torch.Tensor) -> torch.Tensor:
        """
        Args:
            y_pred: model output, logits OR probabilities, shape [B, C, H, W]
            y_true: binary ground-truth mask, shape [B, C, H, W]
        """
        # Auto-detect logits vs. probabilities and apply sigmoid if needed.
        if y_pred.min() < 0.0 or y_pred.max() > 1.0:
            y_pred = torch.sigmoid(y_pred)

        loss_dice = self.soft_dice_loss(y_pred, y_true)
        loss_cldice = self.soft_cldice_loss(y_pred, y_true)

        return (1.0 - self.alpha) * loss_dice + self.alpha * loss_cldice


if __name__ == "__main__":
    # Quick self-test / sanity check for the 30-hour hackathon environment.
    torch.manual_seed(0)
    pred = torch.rand(2, 1, 64, 64)
    true = (torch.rand(2, 1, 64, 64) > 0.9).float()  # sparse "road-like" mask

    criterion = SoftDiceclDiceLoss(alpha=0.5, num_iterations=3)
    loss = criterion(pred, true)
    print(f"[losses.py self-test] SoftDiceclDiceLoss = {loss.item():.4f}")
