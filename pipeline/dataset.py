"""
dataset.py
==========
PyTorch Dataset for the DeepGlobe Road Extraction Dataset
(kaggle.com/datasets/balraj98/deepglobe-road-extraction-dataset).

Expected directory layout after unzipping:
    root/
        train/
            1_sat.jpg
            1_mask.png
            2_sat.jpg
            2_mask.png
            ...

There is no official val/test mask split (test/valid dirs have images but
no masks), so this module carves a validation split out of `train/` itself
(seeded, reproducible) -- standard practice for this dataset.
"""

import glob
import os
import random
from typing import List, Tuple

import albumentations as A
import cv2
import numpy as np
import torch
from albumentations.pytorch import ToTensorV2
from torch.utils.data import Dataset


def build_transforms(img_size: int = 512, train: bool = True) -> A.Compose:
    """
    Augmentation pipeline using Albumentations (per the problem statement's
    "commended stack"). Training augmentations simulate the occlusion /
    illumination variance called out in the problem statement (canopy
    shadows, seasonal lighting) so the model learns to be robust to them.
    """
    if train:
        return A.Compose([
            A.RandomCrop(img_size, img_size) if False else A.RandomResizedCrop(
                size=(img_size, img_size), scale=(0.7, 1.0), ratio=(0.9, 1.1)
            ),
            A.HorizontalFlip(p=0.5),
            A.VerticalFlip(p=0.5),
            A.RandomRotate90(p=0.5),
            # Simulates shadow / canopy occlusion and lighting variance.
            A.RandomBrightnessContrast(brightness_limit=0.25, contrast_limit=0.25, p=0.5),
            A.HueSaturationValue(hue_shift_limit=10, sat_shift_limit=20, val_shift_limit=15, p=0.3),
            A.CoarseDropout(num_holes_range=(1, 4), hole_height_range=(0.03, 0.12),
                             hole_width_range=(0.03, 0.12), fill=0, p=0.3),  # synthetic occlusion
            A.GaussNoise(p=0.2),
            A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
            ToTensorV2(),
        ])
    else:
        return A.Compose([
            A.Resize(img_size, img_size),
            A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
            ToTensorV2(),
        ])


class DeepGlobeRoadDataset(Dataset):
    """
    Args:
        root: path to the DeepGlobe `train/` directory containing *_sat.jpg
            and *_mask.png pairs.
        file_ids: list of numeric IDs to include (used to implement the
            train/val split -- see `make_train_val_split` below).
        img_size: resize/crop resolution. 512 is a good VRAM/quality
            trade-off for a 15GB Colab GPU; drop to 384 if you hit OOM.
        train: whether to apply training augmentations.
    """

    def __init__(self, root: str, file_ids: List[str], img_size: int = 512, train: bool = True):
        self.root = root
        self.file_ids = file_ids
        self.transform = build_transforms(img_size, train=train)

    def __len__(self) -> int:
        return len(self.file_ids)

    def __getitem__(self, idx: int):
        file_id = self.file_ids[idx]
        img_path = os.path.join(self.root, f"{file_id}_sat.jpg")
        mask_path = os.path.join(self.root, f"{file_id}_mask.png")

        image = cv2.cvtColor(cv2.imread(img_path), cv2.COLOR_BGR2RGB)
        mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)

        # DeepGlobe masks are not guaranteed pure {0, 255} -- binarize at
        # threshold 128 per the dataset's own documentation.
        mask = (mask >= 128).astype(np.float32)

        augmented = self.transform(image=image, mask=mask)
        image_t = augmented["image"]                       # [3, H, W] float
        mask_t = augmented["mask"].unsqueeze(0).float()     # [1, H, W] float

        return image_t, mask_t


def make_train_val_split(root: str, val_fraction: float = 0.1, seed: int = 42
                          ) -> Tuple[List[str], List[str]]:
    """
    Scans `root` for all *_sat.jpg files, extracts their numeric IDs, and
    splits into train/val id lists (seeded shuffle for reproducibility).
    """
    sat_paths = glob.glob(os.path.join(root, "*_sat.jpg"))
    file_ids = sorted(os.path.basename(p).replace("_sat.jpg", "") for p in sat_paths)

    rng = random.Random(seed)
    rng.shuffle(file_ids)

    n_val = max(1, int(len(file_ids) * val_fraction))
    val_ids = file_ids[:n_val]
    train_ids = file_ids[n_val:]
    return train_ids, val_ids
