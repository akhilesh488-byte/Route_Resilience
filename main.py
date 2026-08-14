"""
main.py
=======
End-to-end orchestration of the occlusion-robust road extraction and
graph-theoretic criticality pipeline, tying together every module built
strictly from the research documents:

    Phase I   (model.py, losses.py)      -> occlusion-robust segmentation
    Phase II  (mask_to_graph.py,
               graph_healing.py)         -> vectorized, healed road graph
    Phase III (centrality.py,
               resilience.py)            -> bottleneck ID + stress testing

Run as a script for a quick hackathon demo on a single tile:
    python main.py --image path/to/tile.tif --checkpoint path/to/model.pt

Or import `run_pipeline(...)` directly from a Streamlit dashboard (Phase IV).
"""

import argparse
from dataclasses import dataclass, field
from typing import Dict, Optional

import networkx as nx
import numpy as np
import torch

from pipeline.model import build_model
from pipeline.mask_to_graph import build_graph_from_mask
from pipeline.graph_healing import heal_graph, connectivity_ratio
from pipeline.centrality import compute_betweenness_centrality, top_gatekeeper_nodes
from pipeline.resilience import run_dynamic_ablation, run_static_ablation


@dataclass
class PipelineConfig:
    """Central knobs for a 30-hour-hackathon-friendly run."""
    device: str = "cuda" if torch.cuda.is_available() else "cpu"
    backbone: str = "resnet50"          # faster to iterate on than resnet101
    seg_threshold: float = 0.5          # binarization threshold on sigmoid output
    max_gap_distance: float = 60.0      # px; healing search radius
    angle_weight: float = 40.0          # healing angular-penalty weight
    exact_centrality_threshold: int = 2000
    approx_centrality_k: int = 250
    ablation_mode: str = "dynamic"      # "dynamic" (accurate) or "static" (fast)
    ablation_step: float = 0.02


@dataclass
class PipelineResult:
    prob_map: np.ndarray = None
    binary_mask: np.ndarray = None
    raw_graph: nx.Graph = None
    healed_graph: nx.Graph = None
    connectivity_ratio_pct: float = 0.0
    centrality: Dict = field(default_factory=dict)
    gatekeeper_nodes: list = field(default_factory=list)
    ablation_results: Dict = field(default_factory=dict)


def load_model(checkpoint_path: Optional[str], config: PipelineConfig):
    """
    Loads the DeepLabV3+ model. If no checkpoint is supplied, returns an
    ImageNet-pretrained-backbone model (untrained head) -- useful for
    wiring/testing the rest of the pipeline (graph healing, centrality,
    resilience) before segmentation training finishes, since Phase I and
    Phase II/III can be developed in parallel per the problem statement's
    suggested hackathon workflow.
    """
    model = build_model(num_classes=1, backbone=config.backbone, pretrained=(checkpoint_path is None))
    if checkpoint_path:
        state_dict = torch.load(checkpoint_path, map_location=config.device)
        model.load_state_dict(state_dict)
    model.to(config.device)
    model.eval()
    return model


def segment_tile(model: torch.nn.Module, image: np.ndarray, config: PipelineConfig):
    """
    Runs inference on a single [H, W, 3] uint8/float image tile.

    Returns:
        prob_map: [H, W] float32 sigmoid probability map
        binary_mask: [H, W] uint8 {0, 1} thresholded mask
    """
    if image.dtype != np.float32:
        image = image.astype(np.float32) / 255.0

    tensor = torch.from_numpy(image).permute(2, 0, 1).unsqueeze(0).to(config.device)

    with torch.no_grad():
        logits = model(tensor)
        probs = torch.sigmoid(logits)

    prob_map = probs.squeeze().cpu().numpy()
    binary_mask = (prob_map >= config.seg_threshold).astype(np.uint8)
    return prob_map, binary_mask


def run_pipeline(
    image: np.ndarray,
    config: PipelineConfig,
    model: Optional[torch.nn.Module] = None,
    checkpoint_path: Optional[str] = None,
    precomputed_mask: Optional[np.ndarray] = None,
) -> PipelineResult:
    """
    Full end-to-end run: segmentation -> graph extraction -> healing ->
    centrality -> resilience stress test.

    Args:
        image: [H, W, 3] satellite tile (RGB). Ignored if precomputed_mask
            is supplied (useful for the "mock/open-source vector baseline"
            parallel-track workflow the problem statement describes, where
            the graph team develops against ground-truth OSM masks while
            the DL team is still training).
        precomputed_mask: optional [H, W] binary mask to skip segmentation
            entirely.

    Returns:
        PipelineResult with every intermediate artifact populated, ready
        for a Streamlit/Leaflet.js dashboard (Phase IV) to render.
    """
    result = PipelineResult()

    # ---- Phase I: Occlusion-Robust Segmentation ---------------------------
    if precomputed_mask is not None:
        result.binary_mask = precomputed_mask.astype(np.uint8)
        result.prob_map = precomputed_mask.astype(np.float32)
    else:
        if model is None:
            model = load_model(checkpoint_path, config)
        result.prob_map, result.binary_mask = segment_tile(model, image, config)

    # ---- Phase II: Topological Reconstruction (skeletonize -> graph) ------
    result.raw_graph = build_graph_from_mask(result.binary_mask)

    # ---- Phase II: Topological Healing (MST + Disjoint Set) ---------------
    result.healed_graph = heal_graph(
        result.raw_graph,
        max_gap_distance=config.max_gap_distance,
        angle_weight=config.angle_weight,
    )
    result.connectivity_ratio_pct = connectivity_ratio(result.raw_graph, result.healed_graph)

    # ---- Phase III: Structural Intelligence (Betweenness Centrality) ------
    result.centrality = compute_betweenness_centrality(
        result.healed_graph,
        weight="weight",
        exact_threshold=config.exact_centrality_threshold,
        approx_k=config.approx_centrality_k,
    )
    result.gatekeeper_nodes = top_gatekeeper_nodes(result.centrality, top_n=10)

    # ---- Phase III: Simulated Stress Testing (Node Ablation) --------------
    ablation_fn = run_dynamic_ablation if config.ablation_mode == "dynamic" else run_static_ablation
    result.ablation_results = ablation_fn(
        result.healed_graph, removal_fraction_step=config.ablation_step, weight="weight"
    )

    return result


def _print_summary(result: PipelineResult):
    print("=" * 70)
    print("PIPELINE SUMMARY")
    print("=" * 70)
    print(f"Raw graph:    {result.raw_graph.number_of_nodes()} nodes, "
          f"{result.raw_graph.number_of_edges()} edges")
    print(f"Healed graph: {result.healed_graph.number_of_nodes()} nodes, "
          f"{result.healed_graph.number_of_edges()} edges")
    print(f"Connectivity Ratio improvement: {result.connectivity_ratio_pct:.2f}%")
    print(f"Top 5 Gatekeeper Nodes (node_id, betweenness centrality):")
    for node_id, score in result.gatekeeper_nodes[:5]:
        print(f"    Node {node_id}: {score:.4f}")
    print(f"Resilience Index (AUC of GCC curve): "
          f"{result.ablation_results.get('resilience_index', float('nan')):.4f}")
    print("=" * 70)


def main():
    parser = argparse.ArgumentParser(description="Occlusion-robust road extraction + criticality pipeline")
    parser.add_argument("--image", type=str, default=None, help="Path to input satellite tile (RGB image)")
    parser.add_argument("--mask", type=str, default=None,
                         help="Path to a precomputed binary road mask (skips segmentation)")
    parser.add_argument("--checkpoint", type=str, default=None, help="Path to trained model .pt checkpoint")
    parser.add_argument("--ablation-mode", type=str, default="dynamic", choices=["dynamic", "static"])
    args = parser.parse_args()

    config = PipelineConfig(ablation_mode=args.ablation_mode)

    if args.mask:
        from PIL import Image
        mask = np.array(Image.open(args.mask).convert("L"))
        mask = (mask > 127).astype(np.uint8)
        result = run_pipeline(image=None, config=config, precomputed_mask=mask)
    elif args.image:
        from PIL import Image
        image = np.array(Image.open(args.image).convert("RGB"))
        result = run_pipeline(image=image, config=config, checkpoint_path=args.checkpoint)
    else:
        # No inputs given -> run a synthetic smoke test so the pipeline's
        # wiring can be validated without any real data (useful the moment
        # the hackathon starts, before imagery/checkpoints are ready).
        print("No --image or --mask supplied; running synthetic smoke test...\n")
        synthetic_mask = np.zeros((256, 256), dtype=np.uint8)
        synthetic_mask[100:105, :] = 1
        synthetic_mask[:, 100:105] = 1
        synthetic_mask[150:155, 120:256] = 1  # a disconnected fragment to heal
        result = run_pipeline(image=None, config=config, precomputed_mask=synthetic_mask)

    _print_summary(result)


if __name__ == "__main__":
    main()
