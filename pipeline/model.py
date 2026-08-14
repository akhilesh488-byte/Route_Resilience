"""
model.py
========
DeepLabV3+ (ResNet backbone) segmentation model for occlusion-robust road
extraction, built exactly to the architectural spec in research doc:
"DeepLabV3+ (ResNet Backbone) vs. DenseDDSSPP".

This is the baseline "commended stack" model (U-Net/DeepLabV3+ w/ ResNet,
PyTorch) called out in the problem statement's Phase I. It is chosen over
DenseDDSSPP/Xception here because torchvision ships ResNet with pretrained
ImageNet weights out-of-the-box, which is critical for a 30-hour hackathon
where training-from-scratch on satellite imagery is not viable.

Architecture (from the research spec):
    Backbone:  ResNet-101 (or ResNet-50), atrous convolutions in the final
               stage so output stride can be kept at 16 instead of the
               standard 32 (preserves spatial detail needed for thin roads).
    ASPP:
        Branch 1: 1x1 conv, 256 channels
        Branch 2-4: 3x3 atrous convs, dilation rates d = (6, 12, 18) @ OS=16
        Branch 5: image-level pooling -> 1x1 conv -> bilinear upsample
        Fusion: concat -> 1x1 conv (256) -> BN -> ReLU
    Decoder:
        - Upsample ASPP output x4 (bilinear)
        - Low-level features (early ResNet block) -> 1x1 conv, 256 -> 48 ch
        - Concatenate upsampled ASPP + low-level features
        - 2x [3x3 conv, 256 ch] to refine boundaries
        - Upsample x4 (bilinear) to restore full input resolution
        - 1x1 conv -> num_classes logits
"""

from typing import List

import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models
from torchvision.models.resnet import ResNet50_Weights, ResNet101_Weights


class ASPPBranch(nn.Sequential):
    """A single ASPP branch: dilated (atrous) 3x3 conv -> BN -> ReLU."""

    def __init__(self, in_channels: int, out_channels: int, dilation: int):
        kernel_size = 1 if dilation == 1 else 3
        padding = 0 if dilation == 1 else dilation
        super().__init__(
            nn.Conv2d(in_channels, out_channels, kernel_size,
                      padding=padding, dilation=dilation, bias=False),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
        )


class ASPPPooling(nn.Module):
    """Branch 5: Image-level pooling -> 1x1 conv -> bilinear upsample back."""

    def __init__(self, in_channels: int, out_channels: int):
        super().__init__()
        self.pool = nn.AdaptiveAvgPool2d(1)
        self.conv = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, 1, bias=False),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        size = x.shape[-2:]
        x = self.pool(x)
        x = self.conv(x)
        return F.interpolate(x, size=size, mode="bilinear", align_corners=False)


class ASPP(nn.Module):
    """
    Atrous Spatial Pyramid Pooling.

    5 parallel branches (1x1 conv, three 3x3 atrous convs at rates
    (6, 12, 18), and image-level pooling) fused via concat -> 1x1 conv ->
    BN -> ReLU -> Dropout.
    """

    def __init__(self, in_channels: int, out_channels: int = 256,
                 atrous_rates: List[int] = (6, 12, 18)):
        super().__init__()
        self.branch1 = ASPPBranch(in_channels, out_channels, dilation=1)   # 1x1 conv
        self.branch2 = ASPPBranch(in_channels, out_channels, dilation=atrous_rates[0])
        self.branch3 = ASPPBranch(in_channels, out_channels, dilation=atrous_rates[1])
        self.branch4 = ASPPBranch(in_channels, out_channels, dilation=atrous_rates[2])
        self.branch5 = ASPPPooling(in_channels, out_channels)

        self.fuse = nn.Sequential(
            nn.Conv2d(out_channels * 5, out_channels, 1, bias=False),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        feats = torch.cat(
            [self.branch1(x), self.branch2(x), self.branch3(x),
             self.branch4(x), self.branch5(x)],
            dim=1,
        )
        return self.fuse(feats)


class ResNetAtrousBackbone(nn.Module):
    """
    ResNet-50/101 backbone modified for DeepLabV3+:
        - stem + layer1 + layer2 kept at their normal stride (this is where
          we tap the LOW-LEVEL features for the decoder skip connection)
        - layer3 kept at stride 2 (as usual)
        - layer4 stride is REPLACED with dilation so the final feature map
          stays at output_stride=16 instead of 32, preserving the spatial
          resolution needed to segment thin road structures.
    """

    def __init__(self, backbone: str = "resnet101", pretrained: bool = True,
                 output_stride: int = 16):
        super().__init__()
        assert output_stride in (8, 16), "output_stride must be 8 or 16"

        # torchvision's `replace_stride_with_dilation` flag correctly swaps a
        # stage's stride-2 downsampling (in BOTH the main conv path and the
        # 1x1 shortcut/downsample path) for a dilated, stride-1 convolution,
        # keeping every branch's spatial dimensions consistent. Hand-rolling
        # this (e.g. only patching 3x3 convs) breaks the residual add
        # because the shortcut path's stride is left untouched -- so we rely
        # on the built-in, well-tested torchvision mechanism instead.
        #   output_stride=16 -> dilate layer4 only:          [False, False, True]
        #   output_stride=8  -> dilate layer3 AND layer4:     [False, True,  True]
        dilate_layer3 = (output_stride == 8)
        replace_flags = [False, dilate_layer3, True]

        if backbone == "resnet101":
            weights = ResNet101_Weights.DEFAULT if pretrained else None
            net = models.resnet101(weights=weights, replace_stride_with_dilation=replace_flags)
        elif backbone == "resnet50":
            weights = ResNet50_Weights.DEFAULT if pretrained else None
            net = models.resnet50(weights=weights, replace_stride_with_dilation=replace_flags)
        else:
            raise ValueError(f"Unsupported backbone: {backbone}")

        self.stem = nn.Sequential(net.conv1, net.bn1, net.relu, net.maxpool)
        self.layer1 = net.layer1          # low-level features tap (stride 4)
        self.layer2 = net.layer2          # stride 8
        self.layer3 = net.layer3          # stride 16, or dilated-stride-8 if OS=8
        self.layer4 = net.layer4          # high-level features (ASPP input), dilated

        self.low_level_channels = 256     # layer1 output channels (ResNet-50/101)
        self.high_level_channels = 2048   # layer4 output channels

    def forward(self, x: torch.Tensor):
        x = self.stem(x)
        low_level_feat = self.layer1(x)   # tapped for decoder skip connection
        x = self.layer2(low_level_feat)
        x = self.layer3(x)
        high_level_feat = self.layer4(x)  # fed into ASPP
        return low_level_feat, high_level_feat


class DeepLabV3Plus(nn.Module):
    """
    Full DeepLabV3+ model: ResNetAtrousBackbone -> ASPP -> Decoder.

    forward() returns raw logits of shape [B, num_classes, H, W] at the
    ORIGINAL input resolution -- apply sigmoid/softmax externally (the loss
    functions in losses.py auto-detect logits vs. probabilities).
    """

    def __init__(self, num_classes: int = 1, backbone: str = "resnet101",
                 pretrained: bool = True, output_stride: int = 16,
                 low_level_out_channels: int = 48):
        super().__init__()
        self.backbone = ResNetAtrousBackbone(backbone, pretrained, output_stride)
        self.aspp = ASPP(self.backbone.high_level_channels, out_channels=256)

        # Decoder: reduce low-level channels 256 -> 48 (per spec) before concat
        self.low_level_reduce = nn.Sequential(
            nn.Conv2d(self.backbone.low_level_channels, low_level_out_channels, 1, bias=False),
            nn.BatchNorm2d(low_level_out_channels),
            nn.ReLU(inplace=True),
        )

        decoder_in_channels = 256 + low_level_out_channels
        self.decoder_refine = nn.Sequential(
            nn.Conv2d(decoder_in_channels, 256, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
        )
        self.classifier = nn.Conv2d(256, num_classes, kernel_size=1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        input_size = x.shape[-2:]

        low_level_feat, high_level_feat = self.backbone(x)
        aspp_out = self.aspp(high_level_feat)

        # Upsample ASPP output x4 to match low-level feature spatial size
        aspp_up = F.interpolate(aspp_out, size=low_level_feat.shape[-2:],
                                 mode="bilinear", align_corners=False)

        low_level_feat = self.low_level_reduce(low_level_feat)
        decoder_in = torch.cat([aspp_up, low_level_feat], dim=1)
        decoder_out = self.decoder_refine(decoder_in)

        logits = self.classifier(decoder_out)
        # Final upsample back to full input resolution
        logits = F.interpolate(logits, size=input_size, mode="bilinear", align_corners=False)
        return logits


def build_model(num_classes: int = 1, backbone: str = "resnet50",
                 pretrained: bool = True) -> DeepLabV3Plus:
    """
    Convenience factory. Defaults to ResNet-50 (not ResNet-101) for the
    30-hour hackathon: faster to train/iterate on with only a modest
    accuracy trade-off, per the "commended stack" guidance.
    """
    return DeepLabV3Plus(num_classes=num_classes, backbone=backbone, pretrained=pretrained)


if __name__ == "__main__":
    # Sanity check with a small dummy tensor (use a real GPU batch size in training).
    # NOTE: .eval() is required here because batch=1 with the ASPP image-level
    # pooling branch collapses spatial dims to 1x1, which BatchNorm cannot
    # compute batch statistics for in .train() mode -- use batch_size >= 2
    # (or GroupNorm) if you need to sanity-check training-mode forward passes.
    model = build_model(num_classes=1, backbone="resnet50", pretrained=False)
    model.eval()
    dummy = torch.randn(1, 3, 256, 256)
    with torch.no_grad():
        out = model(dummy)
    print(f"[model.py self-test] output shape: {tuple(out.shape)}  (expected (1, 1, 256, 256))")
