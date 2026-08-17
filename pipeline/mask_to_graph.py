"""
mask_to_graph.py
=================
Converts a 2D binary road mask (model prediction) into a vectorized
topological graph (nodes = intersections/endpoints, edges = road segments),
implementing the 5-step pipeline from research doc:
"step-by-step logic for converting a 2D binary road mask into a graph of
nodes and edges using morphological skeletonization".

Pipeline:
    Step 1: Morphological skeletonization (skimage) -> 1px-wide centerline
    Step 2: Node classification via the Laplacian-style 8-neighborhood kernel
    Step 3: Connected-component clustering of node pixels -> centroids
    Step 4: Skeleton slicing + connected-component labeling -> edges
    Step 5: Build the final networkx.Graph()

Uses the "commended stack" (Scikit-Image) for skeletonization, and
scipy.ndimage for connected component labeling, as recommended.
"""

from typing import Dict, List, Tuple

import networkx as nx
import numpy as np
from scipy import ndimage
from scipy.signal import convolve2d
from skimage.morphology import skeletonize


# ---------------------------------------------------------------------------
# Step 1: Morphological Skeletonization
# ---------------------------------------------------------------------------
def extract_skeleton(binary_mask: np.ndarray) -> np.ndarray:
    """
    Reduce a broad, multi-pixel-wide binary road mask to a 1-pixel-wide
    medial-axis skeleton, preserving homotopy (topological connectivity).

    Args:
        binary_mask: 2D array (H, W), values in {0, 1} or {0, 255} / bool.

    Returns:
        skeleton: 2D boolean array (H, W), 1px-wide centerlines.
    """
    mask_bool = binary_mask.astype(bool)
    # skimage's default `skeletonize` implements a Zhang-Suen-style thinning.
    skeleton = skeletonize(mask_bool)
    return skeleton


# ---------------------------------------------------------------------------
# Step 2: Node (endpoint / intersection) identification
# ---------------------------------------------------------------------------
# 2D Laplacian-style neighbor-counting kernel, per the spec:
#   V(x,y) = 8*I(x,y) - sum(8-neighborhood)
# For an active skeleton pixel (I=1):
#   V == 7  -> endpoint      (1 neighbor,  degree 1)
#   V == 6  -> regular pixel (2 neighbors, degree 2)
#   V <= 5  -> intersection  (>=3 neighbors, degree >=3)
_NEIGHBOR_KERNEL = np.array(
    [[-1, -1, -1],
     [-1,  8, -1],
     [-1, -1, -1]],
    dtype=np.int32,
)


def classify_node_pixels(skeleton: np.ndarray) -> np.ndarray:
    """
    Applies the neighbor-mapping convolution kernel to classify every active
    skeleton pixel as an endpoint, regular segment pixel, or intersection.

    Returns:
        node_pixels: 2D boolean array, True where a pixel is a topological
        NODE (endpoint OR intersection, i.e. NOT a plain degree-2 pixel).
    """
    skel_int = skeleton.astype(np.int32)
    # 'same' mode + zero-padding mirrors the convolution described; boundary
    # pixels are naturally treated as having fewer neighbors (edge case-safe
    # for endpoints that touch the image border).
    V = convolve2d(skel_int, _NEIGHBOR_KERNEL, mode="same", boundary="fill", fillvalue=0)

    # Node_Pixels = (V < 6) U (V == 7), restricted to active skeleton pixels.
    is_node = ((V < 6) | (V == 7)) & skeleton
    return is_node


# ---------------------------------------------------------------------------
# Step 3: Node clustering & centroid extraction
# ---------------------------------------------------------------------------
def cluster_nodes(node_pixels: np.ndarray) -> List[Tuple[float, float]]:
    """
    Groups adjacent node-pixel "blobs" (e.g. a 2x2 cluster at a single
    T-junction) into individual nodes via 8-connected component labeling,
    then computes the centroid of each blob so NetworkX gets ONE coordinate
    per physical intersection/endpoint (not duplicates).

    Returns:
        centroids: list of (y, x) float centroid coordinates.
    """
    # 8-connectivity structuring element
    structure = np.ones((3, 3), dtype=int)
    labeled, num_features = ndimage.label(node_pixels, structure=structure)

    centroids = ndimage.center_of_mass(
        node_pixels, labeled, index=range(1, num_features + 1)
    )
    return centroids  # list of (y, x) tuples


# ---------------------------------------------------------------------------
# Step 4: Edge extraction & connection logic
# ---------------------------------------------------------------------------
def extract_edges(
    skeleton: np.ndarray,
    node_pixels: np.ndarray,
    node_centroids: List[Tuple[float, float]],
    roi_half_size: int = 4,
) -> Dict[int, List[int]]:
    """
    Slices the skeleton at node locations to isolate individual road-segment
    curves, labels them, then determines which nodes each edge segment
    touches via a local ROI neighbor scan.

    Args:
        roi_half_size: half-width of the square ROI window used to scan for
            edge labels around each node. The spec suggests a 5x5 window
            (roi_half_size=2), but node-pixel clusters at real junctions
            are themselves often multi-pixel blobs (e.g. a plus-shaped
            5-pixel cluster at a 4-way intersection); once dilated for
            slicing, a tight 5x5 window can miss the severed edge stubs
            entirely. Default is widened to roi_half_size=4 (9x9) for
            robustness -- tune down for tighter/cleaner skeletons.

    Returns:
        node_to_edge_labels: dict mapping node index (0-based, matching
        node_centroids order) -> list of edge label IDs touching that node.
    """
    H, W = skeleton.shape

    # 4-connected dilation of the node-pixel mask so cutting also removes the
    # immediate neighbors of each node, guaranteeing a clean break between
    # segments (per spec: "node coordinates AND their immediate 4-connected
    # neighbors are set to 0").
    dilated_nodes = ndimage.binary_dilation(
        node_pixels, structure=ndimage.generate_binary_structure(2, 1)  # 4-connectivity
    )

    sliced_skeleton = skeleton & ~dilated_nodes

    # Label the remaining disjoint curves (8-connectivity, since a road
    # segment's own pixel-to-pixel connectivity may be diagonal).
    edge_structure = np.ones((3, 3), dtype=int)
    labeled_edges, _ = ndimage.label(sliced_skeleton, structure=edge_structure)

    node_to_edge_labels: Dict[int, List[int]] = {}
    for idx, (cy, cx) in enumerate(node_centroids):
        cy_i, cx_i = int(round(cy)), int(round(cx))
        y0, y1 = max(0, cy_i - roi_half_size), min(H, cy_i + roi_half_size + 1)
        x0, x1 = max(0, cx_i - roi_half_size), min(W, cx_i + roi_half_size + 1)

        roi = labeled_edges[y0:y1, x0:x1]
        touching_labels = sorted(set(roi.flatten().tolist()) - {0})
        node_to_edge_labels[idx] = touching_labels

    return node_to_edge_labels, labeled_edges


def _edge_pixel_coords(labeled_edges: np.ndarray, label_id: int) -> List[Tuple[int, int]]:
    """Retrieve the (y, x) pixel coordinate sequence of a given edge label."""
    ys, xs = np.where(labeled_edges == label_id)
    return list(zip(ys.tolist(), xs.tolist()))


# ---------------------------------------------------------------------------
# Step 5: Construct the NetworkX Graph
# ---------------------------------------------------------------------------
def build_graph_from_mask(binary_mask: np.ndarray, roi_half_size: int = 4) -> nx.Graph:
    """
    End-to-end orchestration of Steps 1-5: binary mask -> networkx.Graph.

    Nodes carry:
        - 'pos': (x, y) coordinate tuple (x=col, y=row -- convenient for
          plotting with matplotlib/QGIS which expect (x, y))
        - 'y', 'x': raw row/col centroid floats

    Edges carry:
        - 'pts': the physical pixel coordinate sequence of the road segment
          (preserves curved geometry instead of a straight-line abstraction)
        - 'length': Euclidean path length summed along `pts` (useful later
          as an edge weight for centrality / shortest-path calculations)

    Returns:
        G: networkx.Graph representing the road network topology.
    """
    skeleton = extract_skeleton(binary_mask)
    node_pixel_mask = classify_node_pixels(skeleton)
    centroids = cluster_nodes(node_pixel_mask)

    if len(centroids) == 0:
        # Degenerate case: no nodes found (e.g. empty or fully-connected-loop
        # mask). Return an empty graph rather than raising, so the pipeline
        # keeps running for a batch of tiles during a hackathon demo.
        return nx.Graph()

    node_to_edge_labels, labeled_edges = extract_edges(
        skeleton, node_pixel_mask, centroids, roi_half_size=roi_half_size
    )

    G = nx.Graph()
    for idx, (cy, cx) in enumerate(centroids):
        G.add_node(idx, pos=(float(cx), float(cy)), y=float(cy), x=float(cx))

    # Build a reverse lookup: edge_label -> [node indices touching it]
    label_to_nodes: Dict[int, List[int]] = {}
    for node_idx, labels in node_to_edge_labels.items():
        for lbl in labels:
            label_to_nodes.setdefault(lbl, []).append(node_idx)

    # An edge label connecting exactly 2 distinct nodes becomes a graph edge.
    # (A label touching only 1 node is a dead-end stub / self-loop artifact
    # and is skipped; a label touching >2 nodes -- rare with a tight ROI --
    # is connected pairwise as a fallback.)
    for lbl, node_list in label_to_nodes.items():
        unique_nodes = sorted(set(node_list))
        if len(unique_nodes) < 2:
            continue
        pts = _edge_pixel_coords(labeled_edges, lbl)
        length = _polyline_length(pts)

        for i in range(len(unique_nodes) - 1):
            u, v = unique_nodes[i], unique_nodes[i + 1]
            if u == v:
                continue
            G.add_edge(u, v, pts=pts, length=length, weight=max(length, 1e-3))

    return G


def _polyline_length(pts: List[Tuple[int, int]]) -> float:
    """Approximate Euclidean arc length of an (unordered) pixel set as a
    conservative proxy: pixel count is used when pts aren't ordered, since
    exact ordering would require an additional tracing pass. This is a
    hackathon-friendly O(1) approximation; for higher precision, order the
    points via nearest-neighbor chaining before summing segment lengths."""
    return float(len(pts))


if __name__ == "__main__":
    # Sanity check with a synthetic "plus-shaped" road mask.
    mask = np.zeros((50, 50), dtype=np.uint8)
    mask[24:26, :] = 1   # horizontal road
    mask[:, 24:26] = 1   # vertical road (crosses -> 1 intersection, 4 endpoints)

    G = build_graph_from_mask(mask)
    print(f"[mask_to_graph.py self-test] Nodes: {G.number_of_nodes()}, Edges: {G.number_of_edges()}")
