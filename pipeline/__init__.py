"""
Occlusion-Robust Road Extraction & Graph-Theoretic Criticality Pipeline
========================================================================
Modules:
    losses        - SoftSkeleton2D, SoftDiceclDiceLoss (topological loss)
    model         - DeepLabV3+ (ResNet backbone) segmentation model
    mask_to_graph - binary mask -> NetworkX graph via skeletonization
    graph_healing - MST + Disjoint Set topological healing
    centrality    - Betweenness Centrality ("Gatekeeper Node" detection)
    resilience    - Global Efficiency + Node Ablation stress testing
"""

from .losses import SoftSkeleton2D, SoftDiceclDiceLoss
from .model import DeepLabV3Plus, build_model
from .mask_to_graph import build_graph_from_mask
from .graph_healing import heal_graph, connectivity_ratio
from .centrality import compute_betweenness_centrality, top_gatekeeper_nodes
from .resilience import (
    global_efficiency,
    run_dynamic_ablation,
    run_static_ablation,
    simulate_single_node_failure,
)

__all__ = [
    "SoftSkeleton2D", "SoftDiceclDiceLoss",
    "DeepLabV3Plus", "build_model",
    "build_graph_from_mask",
    "heal_graph", "connectivity_ratio",
    "compute_betweenness_centrality", "top_gatekeeper_nodes",
    "global_efficiency", "run_dynamic_ablation", "run_static_ablation",
    "simulate_single_node_failure",
]
