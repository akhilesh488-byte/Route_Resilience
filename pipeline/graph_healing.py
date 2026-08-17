"""
graph_healing.py
=================
Topological "healing" of a fragmented road graph, per the problem statement's
Phase II spec:

    "Use a Minimum Spanning Tree (MST) and Disjoint Set algorithm to bridge
    gaps caused by extreme occlusions. The algorithm evaluates logical gaps
    based on Euclidean distance and angular alignment to ensure the healed
    road follows a natural trajectory."

This directly guards against the failure mode described in research doc
"algorithmic logic for graph healing": naive nearest-neighbor / raw-MST
bridging creates "ghost connections" -- cutting corners at intersections,
jumping across close parallel roads, or producing sharp, geometrically
impossible angles. We avoid this by:

    1. Only considering CANDIDATE bridges between DIFFERENT connected
       components (a Disjoint-Set / Union-Find structure tracks this
       efficiently) AND only from graph ENDPOINTS (degree-1 nodes) --
       intersections are never bridged directly, which prevents
       "cutting corners" through junctions.
    2. Scoring each candidate bridge by a COMBINED cost of
       (a) Euclidean distance, and
       (b) angular deviation between the bridge direction and the
           endpoint's existing tangent vector (i.e. the direction the road
           was already heading before it was occluded) -- this is the
           "endpoint tangent vector" concept from the research doc, used
           here as an edge-weighting heuristic rather than a full learned
           orientation field, which is out of scope for the fast MST
           healing pass.
    3. Running Kruskal's MST-style healing: sort candidate bridges by cost
       ascending, and only add a bridge if it connects two currently
       DISCONNECTED components (Union-Find `find` check) -- this is exactly
       Kruskal's MST construction rule, restricted to the disconnected-only
       subset of candidate edges so we never touch already-connected roads.
"""

import math
from typing import Dict, List, Tuple

import networkx as nx
import numpy as np


# ---------------------------------------------------------------------------
# Disjoint Set (Union-Find) -- the "Disjoint Set" half of the MST + Disjoint
# Set spec. Near-O(1) amortized find/union via path compression + union by
# rank, which is what makes Kruskal's MST tractable at city scale.
# ---------------------------------------------------------------------------
class DisjointSet:
    def __init__(self, elements):
        self.parent = {e: e for e in elements}
        self.rank = {e: 0 for e in elements}

    def find(self, x):
        # Path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y) -> bool:
        """Returns True if x and y were in different sets (i.e. a merge happened)."""
        rx, ry = self.find(x), self.find(y)
        if rx == ry:
            return False
        # Union by rank
        if self.rank[rx] < self.rank[ry]:
            rx, ry = ry, rx
        self.parent[ry] = rx
        if self.rank[rx] == self.rank[ry]:
            self.rank[rx] += 1
        return True


# ---------------------------------------------------------------------------
# Endpoint tangent-vector estimation
# ---------------------------------------------------------------------------
def _estimate_tangent(G: nx.Graph, endpoint: int, lookback_px: int = 5) -> np.ndarray:
    """
    Estimates the direction the road was traveling as it approached a
    degree-1 endpoint, by looking back along its single incident edge's
    pixel trail ('pts'). This mirrors the research doc's "trace back along
    preceding active road pixels to determine the tangent vector" logic.

    Returns:
        A unit vector (dx, dy). Defaults to a zero-vector if no incident
        edge / pixel trail is available (isolated node), in which case the
        angular-alignment cost term is skipped for that endpoint.
    """
    neighbors = list(G.neighbors(endpoint))
    if not neighbors:
        return np.zeros(2)

    nbr = neighbors[0]
    edge_data = G.get_edge_data(endpoint, nbr, default={})
    pts = edge_data.get("pts", None)
    ep_pos = np.array(G.nodes[endpoint]["pos"])  # (x, y)

    if not pts:
        # Fall back to the straight line to the neighbor node.
        nbr_pos = np.array(G.nodes[nbr]["pos"])
        vec = ep_pos - nbr_pos
    else:
        pts_arr = np.array(pts)  # (row=y, col=x) pairs from mask_to_graph
        pts_xy = pts_arr[:, ::-1].astype(float)  # convert to (x, y)
        # Distance of every traced pixel from the endpoint; take the pixel
        # ~lookback_px away as the "back-trace" reference point.
        dists = np.linalg.norm(pts_xy - ep_pos, axis=1)
        order = np.argsort(dists)
        far_idx = order[min(lookback_px, len(order) - 1)]
        ref_pt = pts_xy[far_idx]
        vec = ep_pos - ref_pt

    norm = np.linalg.norm(vec)
    if norm < 1e-6:
        return np.zeros(2)
    return vec / norm


def _angular_penalty(tangent: np.ndarray, bridge_vec: np.ndarray) -> float:
    """
    Angular alignment penalty in [0, 1]: 0 = bridge continues perfectly
    along the endpoint's existing tangent; 1 = bridge goes in the exact
    opposite direction (i.e. an implausible U-turn / sharp-angle "ghost
    connection" the research doc warns against).
    """
    if np.linalg.norm(tangent) < 1e-6:
        return 0.0  # no tangent info -> don't penalize (distance-only fallback)
    bridge_norm = bridge_vec / (np.linalg.norm(bridge_vec) + 1e-8)
    cos_sim = float(np.clip(np.dot(tangent, bridge_norm), -1.0, 1.0))
    # cos_sim ~ 1 means bridge continues the tangent direction (good).
    return (1.0 - cos_sim) / 2.0


def heal_graph(
    G: nx.Graph,
    max_gap_distance: float = 60.0,
    angle_weight: float = 40.0,
    max_new_edges: int = None,
) -> nx.Graph:
    """
    Bridges topological fragmentation using distance+angle-weighted Kruskal
    MST healing restricted to inter-component endpoint pairs.

    Args:
        G: fragmented road graph (output of mask_to_graph.build_graph_from_mask)
        max_gap_distance: hard cap (pixels) on candidate bridge length --
            prevents absurd long-range "ghost connections" across the whole
            image; tune to your GSD (ground sample distance) / expected
            canopy-gap size.
        angle_weight: scales the angular-penalty term relative to raw
            Euclidean distance in the combined cost function:
                cost = distance + angle_weight * angular_penalty
            Higher -> angle alignment matters more than raw closeness
            (fixes the "jump across close parallel roads" failure mode,
            since a perpendicular jump has high angular penalty even when
            physically close).
        max_new_edges: optional cap on the number of healing bridges added
            (safety valve for pathological/very fragmented inputs during a
            hackathon demo).

    Returns:
        A NEW healed graph (input G is not mutated).
    """
    healed = G.copy()

    # --- Identify candidate bridge endpoints: degree-1 nodes only. ---------
    # Intersections (degree >= 3) are deliberately excluded from direct
    # bridging targets, since connecting straight into a junction is exactly
    # the "corner cutting" ghost-connection failure the research doc flags.
    endpoints = [n for n, d in healed.degree() if d == 1]

    if len(endpoints) < 2:
        return healed  # nothing to heal

    # --- Disjoint Set initialized over ALL nodes (tracks connectivity). ----
    ds = DisjointSet(healed.nodes())
    for u, v in healed.edges():
        ds.union(u, v)

    # --- Precompute tangent vectors for every candidate endpoint. ----------
    tangents = {ep: _estimate_tangent(healed, ep) for ep in endpoints}
    positions = {ep: np.array(healed.nodes[ep]["pos"]) for ep in endpoints}

    # --- Generate + score all candidate bridges between DIFFERENT ----------
    # components, within the max_gap_distance cutoff.
    candidates: List[Tuple[float, int, int]] = []
    for i in range(len(endpoints)):
        for j in range(i + 1, len(endpoints)):
            u, v = endpoints[i], endpoints[j]
            if ds.find(u) == ds.find(v):
                continue  # already connected -- not a fragmentation gap

            pu, pv = positions[u], positions[v]
            dist = float(np.linalg.norm(pu - pv))
            if dist > max_gap_distance:
                continue

            bridge_vec_u = pv - pu  # direction FROM u TOWARD v
            bridge_vec_v = pu - pv  # direction FROM v TOWARD u

            angle_pen_u = _angular_penalty(tangents[u], bridge_vec_u)
            angle_pen_v = _angular_penalty(tangents[v], bridge_vec_v)
            # Both endpoints' tangents should agree with the bridge direction
            # for it to represent a "natural trajectory" continuation.
            combined_angle_penalty = (angle_pen_u + angle_pen_v) / 2.0

            cost = dist + angle_weight * combined_angle_penalty
            candidates.append((cost, u, v))

    # --- Kruskal's MST rule: sort ascending, greedily union if disjoint. ---
    candidates.sort(key=lambda c: c[0])

    added = 0
    for cost, u, v in candidates:
        if max_new_edges is not None and added >= max_new_edges:
            break
        if ds.union(u, v):  # only adds the edge if it MERGES two components
            pu, pv = positions[u], positions[v]
            healed.add_edge(
                u, v,
                pts=[],                      # synthetic edge: no traced pixels
                length=float(np.linalg.norm(pu - pv)),
                weight=max(float(np.linalg.norm(pu - pv)), 1e-3),
                healed=True,                 # flag so downstream code / UI can
                                              # visually distinguish healed links
            )
            added += 1

    return healed


def connectivity_ratio(before: nx.Graph, after: nx.Graph) -> float:
    """
    Evaluation metric from the problem statement:
    "Connectivity Ratio: Percentage increase in the largest connected
    component after the MST healing phase."
    """
    def largest_cc_size(G: nx.Graph) -> int:
        if G.number_of_nodes() == 0:
            return 0
        return len(max(nx.connected_components(G), key=len))

    before_size = largest_cc_size(before)
    after_size = largest_cc_size(after)
    if before_size == 0:
        return 0.0
    return 100.0 * (after_size - before_size) / before_size


if __name__ == "__main__":
    # Sanity check: two disconnected line segments that should heal into one.
    G = nx.Graph()
    G.add_node(0, pos=(0.0, 0.0))
    G.add_node(1, pos=(10.0, 0.0))
    G.add_edge(0, 1, pts=[(0, 0), (0, 10)], length=10.0, weight=10.0)

    G.add_node(2, pos=(15.0, 0.0))   # small gap (occlusion) from node 1
    G.add_node(3, pos=(25.0, 0.0))
    G.add_edge(2, 3, pts=[(0, 15), (0, 25)], length=10.0, weight=10.0)

    healed = heal_graph(G, max_gap_distance=20.0)
    ratio = connectivity_ratio(G, healed)
    print(f"[graph_healing.py self-test] edges before={G.number_of_edges()}, "
          f"after={healed.number_of_edges()}, connectivity_ratio={ratio:.1f}%")
