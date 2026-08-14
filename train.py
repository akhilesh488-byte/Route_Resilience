"""
train.py
========
Training script for the DeepLabV3+ road segmentation model, tuned for a
SINGLE training run on Colab (~15GB VRAM, e.g. a T4).

Key features (all requested):
    - Mixed-precision (AMP) training to make the most of limited VRAM,
      letting you push batch size / image resolution higher than fp32 would.
    - Checkpoints saved every N epochs (default 10) to a directory you
      should point at Google Drive (see the __main__ instructions below),
      so a Colab disconnect never costs you more than N epochs of progress.
    - A `last.pt` checkpoint is ALSO overwritten every single epoch as a
      cheap extra safety net on top of the every-10-epoch requirement.
    - Auto-resume: if a `last.pt` checkpoint already exists in the
      checkpoint dir, training resumes from it automatically (model,
      optimizer, scheduler, scaler, epoch, and full loss history restored)
      -- so re-running the script after a disconnect just continues.
    - At the end (or on Ctrl+C), a Loss-vs-Epoch plot is saved as a PNG,
      plus a CSV of every epoch's train/val loss for your own plotting.

Usage in Colab:
    from google.colab import drive
    drive.mount('/content/drive')

    !python train.py \
        --data-root /content/deepglobe/train \
        --checkpoint-dir /content/drive/MyDrive/road_extraction_ckpts \
        --epochs 60 --batch-size 8 --img-size 512
"""

import argparse
import csv
import os
import time
from dataclasses import dataclass, field
from typing import List, Optional

import torch
from torch.utils.data import DataLoader

from pipeline.model import build_model
from pipeline.losses import SoftDiceclDiceLoss
from pipeline.dataset import DeepGlobeRoadDataset, make_train_val_split


# ---------------------------------------------------------------------------
# Metrics
# ---------------------------------------------------------------------------
@torch.no_grad()
def binary_iou(pred_probs: torch.Tensor, target: torch.Tensor, threshold: float = 0.5,
                eps: float = 1e-6) -> float:
    """Quick IoU metric for tracking segmentation quality during validation."""
    pred = (pred_probs >= threshold).float()
    intersection = (pred * target).sum(dim=(-2, -1))
    union = ((pred + target) >= 1).float().sum(dim=(-2, -1))
    iou = (intersection + eps) / (union + eps)
    return iou.mean().item()


# ---------------------------------------------------------------------------
# Checkpointing
# ---------------------------------------------------------------------------
@dataclass
class TrainState:
    epoch: int = 0
    train_losses: List[float] = field(default_factory=list)
    val_losses: List[float] = field(default_factory=list)
    val_ious: List[float] = field(default_factory=list)
    best_val_loss: float = float("inf")


def save_checkpoint(path: str, model, optimizer, scheduler, scaler, state: TrainState):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    torch.save({
        "model_state": model.state_dict(),
        "optimizer_state": optimizer.state_dict(),
        "scheduler_state": scheduler.state_dict(),
        "scaler_state": scaler.state_dict(),
        "epoch": state.epoch,
        "train_losses": state.train_losses,
        "val_losses": state.val_losses,
        "val_ious": state.val_ious,
        "best_val_loss": state.best_val_loss,
    }, path)


def load_checkpoint(path: str, model, optimizer, scheduler, scaler, device: str) -> TrainState:
    ckpt = torch.load(path, map_location=device)
    model.load_state_dict(ckpt["model_state"])
    optimizer.load_state_dict(ckpt["optimizer_state"])
    scheduler.load_state_dict(ckpt["scheduler_state"])
    scaler.load_state_dict(ckpt["scaler_state"])
    return TrainState(
        epoch=ckpt["epoch"],
        train_losses=ckpt["train_losses"],
        val_losses=ckpt["val_losses"],
        val_ious=ckpt.get("val_ious", []),
        best_val_loss=ckpt["best_val_loss"],
    )


# ---------------------------------------------------------------------------
# Train / validate loops
# ---------------------------------------------------------------------------
def train_one_epoch(model, loader, criterion, optimizer, scaler, device, accum_steps: int) -> float:
    model.train()
    running_loss = 0.0
    optimizer.zero_grad(set_to_none=True)

    for step, (images, masks) in enumerate(loader):
        images = images.to(device, non_blocking=True)
        masks = masks.to(device, non_blocking=True)

        with torch.autocast(device_type="cuda" if device == "cuda" else "cpu",
                             dtype=torch.float16, enabled=(device == "cuda")):
            logits = model(images)
            loss = criterion(logits, masks) / accum_steps

        scaler.scale(loss).backward()

        if (step + 1) % accum_steps == 0:
            scaler.step(optimizer)
            scaler.update()
            optimizer.zero_grad(set_to_none=True)

        running_loss += loss.item() * accum_steps

    return running_loss / len(loader)


@torch.no_grad()
def validate(model, loader, criterion, device) -> tuple:
    model.eval()
    running_loss = 0.0
    running_iou = 0.0

    for images, masks in loader:
        images = images.to(device, non_blocking=True)
        masks = masks.to(device, non_blocking=True)

        with torch.autocast(device_type="cuda" if device == "cuda" else "cpu",
                             dtype=torch.float16, enabled=(device == "cuda")):
            logits = model(images)
            loss = criterion(logits, masks)
            probs = torch.sigmoid(logits)

        running_loss += loss.item()
        running_iou += binary_iou(probs, masks)

    n = len(loader)
    return running_loss / n, running_iou / n


# ---------------------------------------------------------------------------
# Plotting
# ---------------------------------------------------------------------------
def plot_loss_curve(state: TrainState, out_path: str):
    """Saves a Loss-vs-Epoch PNG. Imports matplotlib lazily so the training
    loop itself has no hard dependency on a display backend in Colab."""
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    epochs = range(1, len(state.train_losses) + 1)

    fig, ax1 = plt.subplots(figsize=(9, 6))
    ax1.plot(epochs, state.train_losses, label="Train Loss", color="tab:blue", linewidth=2)
    ax1.plot(epochs, state.val_losses, label="Val Loss", color="tab:orange", linewidth=2)
    ax1.set_xlabel("Epoch")
    ax1.set_ylabel("Soft-Dice + Soft-clDice Loss")
    ax1.set_title("Training Progress: Loss vs. Epoch")
    ax1.legend(loc="upper right")
    ax1.grid(True, alpha=0.3)

    if state.val_ious:
        ax2 = ax1.twinx()
        ax2.plot(epochs, state.val_ious, label="Val IoU", color="tab:green",
                  linestyle="--", linewidth=1.5, alpha=0.7)
        ax2.set_ylabel("Validation IoU")
        ax2.legend(loc="lower right")

    fig.tight_layout()
    fig.savefig(out_path, dpi=150)
    plt.close(fig)
    print(f"Loss curve saved to: {out_path}")


def save_loss_csv(state: TrainState, out_path: str):
    with open(out_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["epoch", "train_loss", "val_loss", "val_iou"])
        for i in range(len(state.train_losses)):
            writer.writerow([
                i + 1,
                state.train_losses[i],
                state.val_losses[i],
                state.val_ious[i] if i < len(state.val_ious) else "",
            ])
    print(f"Loss history CSV saved to: {out_path}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Train DeepLabV3+ road segmentation model")
    parser.add_argument("--data-root", type=str, required=True,
                         help="Path to DeepGlobe 'train/' directory (contains *_sat.jpg / *_mask.png)")
    parser.add_argument("--checkpoint-dir", type=str, required=True,
                         help="Directory for checkpoints -- POINT THIS AT GOOGLE DRIVE in Colab")
    parser.add_argument("--backbone", type=str, default="resnet50", choices=["resnet50", "resnet101"])
    parser.add_argument("--img-size", type=int, default=512)
    parser.add_argument("--batch-size", type=int, default=8)
    parser.add_argument("--accum-steps", type=int, default=1,
                         help="Gradient accumulation steps -- raise this instead of batch size if you OOM")
    parser.add_argument("--epochs", type=int, default=60)
    parser.add_argument("--lr", type=float, default=1e-4)
    parser.add_argument("--weight-decay", type=float, default=1e-4)
    parser.add_argument("--alpha", type=float, default=0.5, help="soft-clDice weight in the hybrid loss")
    parser.add_argument("--val-fraction", type=float, default=0.1)
    parser.add_argument("--num-workers", type=int, default=4)
    parser.add_argument("--checkpoint-every", type=int, default=10)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")
    if device == "cpu":
        print("WARNING: no GPU detected. In Colab: Runtime > Change runtime type > GPU.")

    torch.manual_seed(args.seed)
    os.makedirs(args.checkpoint_dir, exist_ok=True)

    # ---- Data --------------------------------------------------------------
    train_ids, val_ids = make_train_val_split(args.data_root, val_fraction=args.val_fraction, seed=args.seed)
    print(f"Train samples: {len(train_ids)}  |  Val samples: {len(val_ids)}")

    train_ds = DeepGlobeRoadDataset(args.data_root, train_ids, img_size=args.img_size, train=True)
    val_ds = DeepGlobeRoadDataset(args.data_root, val_ids, img_size=args.img_size, train=False)

    train_loader = DataLoader(train_ds, batch_size=args.batch_size, shuffle=True,
                               num_workers=args.num_workers, pin_memory=True, drop_last=True,
                               persistent_workers=args.num_workers > 0)
    val_loader = DataLoader(val_ds, batch_size=args.batch_size, shuffle=False,
                             num_workers=args.num_workers, pin_memory=True,
                             persistent_workers=args.num_workers > 0)

    # ---- Model / loss / optimizer ------------------------------------------
    model = build_model(num_classes=1, backbone=args.backbone, pretrained=True).to(device)
    criterion = SoftDiceclDiceLoss(alpha=args.alpha, num_iterations=3)

    optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=args.weight_decay)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=args.epochs)
    scaler = torch.amp.GradScaler("cuda", enabled=(device == "cuda"))

    # ---- Auto-resume --------------------------------------------------------
    state = TrainState()
    last_ckpt_path = os.path.join(args.checkpoint_dir, "last.pt")
    if os.path.exists(last_ckpt_path):
        print(f"Found existing checkpoint at {last_ckpt_path} -- resuming.")
        state = load_checkpoint(last_ckpt_path, model, optimizer, scheduler, scaler, device)
        print(f"Resumed from epoch {state.epoch}.")

    start_epoch = state.epoch + 1

    # ---- Training loop -------------------------------------------------------
    try:
        for epoch in range(start_epoch, args.epochs + 1):
            t0 = time.time()

            train_loss = train_one_epoch(model, train_loader, criterion, optimizer, scaler,
                                          device, accum_steps=args.accum_steps)
            val_loss, val_iou = validate(model, val_loader, criterion, device)
            scheduler.step()

            state.epoch = epoch
            state.train_losses.append(train_loss)
            state.val_losses.append(val_loss)
            state.val_ious.append(val_iou)

            elapsed = time.time() - t0
            print(f"[Epoch {epoch:03d}/{args.epochs}] "
                  f"train_loss={train_loss:.4f}  val_loss={val_loss:.4f}  "
                  f"val_iou={val_iou:.4f}  lr={scheduler.get_last_lr()[0]:.2e}  "
                  f"({elapsed:.1f}s)")

            # Always overwrite the rolling "last.pt" -- cheap, protects
            # against losing progress mid-way between the every-10 saves.
            save_checkpoint(last_ckpt_path, model, optimizer, scheduler, scaler, state)

            # Best-val checkpoint -- handy for final inference even if the
            # last epoch isn't actually the best one.
            if val_loss < state.best_val_loss:
                state.best_val_loss = val_loss
                save_checkpoint(os.path.join(args.checkpoint_dir, "best.pt"),
                                 model, optimizer, scheduler, scaler, state)

            # Named checkpoint every N epochs, as requested.
            if epoch % args.checkpoint_every == 0:
                named_path = os.path.join(args.checkpoint_dir, f"checkpoint_epoch_{epoch}.pt")
                save_checkpoint(named_path, model, optimizer, scheduler, scaler, state)
                print(f"  -> Saved periodic checkpoint: {named_path}")

    except KeyboardInterrupt:
        print("\nTraining interrupted -- saving current state before exiting...")
        save_checkpoint(last_ckpt_path, model, optimizer, scheduler, scaler, state)

    # ---- Final artifacts: loss curve + CSV -----------------------------------
    plot_loss_curve(state, os.path.join(args.checkpoint_dir, "loss_vs_epoch.png"))
    save_loss_csv(state, os.path.join(args.checkpoint_dir, "loss_history.csv"))

    print(f"\nDone. Best val loss: {state.best_val_loss:.4f}")
    print(f"Use '{os.path.join(args.checkpoint_dir, 'best.pt')}' (or 'last.pt') in your project.")
    print("Load weights for inference with: ckpt = torch.load(path); "
          "model.load_state_dict(ckpt['model_state'])")


if __name__ == "__main__":
    main()
