"""
centrality.py
=============
Betweenness Centrality computation for identifying "Gatekeeper Nodes" /
structural bottlenecks in the healed road graph, per research doc:
"Python implementation logic using NetworkX to calculate Betweenness
Centrality for all nodes in a spatial graph".

C_B(v) = sum_{s != t != v} [ sigma(s,t|v) / sigma(s,t) ]

Implements the exact + approximate strategies from the research, and picks
a sane default automatically based on graph size so a 30-hour hackathon run
doesn't stall on a city-scale graph:

    - Small graphs (< ~2000 nodes): exact Brandes' algorithm (weight=None
      or weight='weight'), as specified.
    - Large graphs: pivot-sampling approximation (k parameter) -- drops
      complexity from O(N*M) to O(k*M), per the research's Strategy #1.

Strategy #2 (topological simplification: collapsing degree-2 nodes) is also
implemented, since it's a pure preprocessing step with "virtually zero
impact on accuracy" per the research and is cheap to apply unconditionally
before any centrality run.
"""

from typing import Dict, Optional

import networkx as nx


# ---------------------------------------------------------------------------
# Strategy 2: Topological simplification (omit sequential degree-2 nodes)
# ---------------------------------------------------------------------------
def simplify_degree2_chains(G: nx.Graph) -> nx.Graph:
    """
    Collapses chains of sequential degree-2 nodes (which represent road
    CURVATURE, not real intersections/endpoints) into a single direct edge
    between their two "real" endpoints, summing the traversed edge weights
    along the way.

    Per the research: on the Seattle road network this reduced node count
    9% / edge count 6%, and cut centrality computation time 14-16% with
    negligible accuracy impact -- a free win, so this is applied by default
    before centrality calculation in `compute_betweenness_centrality`.

    Returns:
        A NEW simplified graph. Node/edge attributes ('pos', etc.) on
        surviving nodes/endpoints are preserved; interior chain nodes are
        removed (their geometry can optionally be preserved via a merged
        'pts' list on the resulting edge -- omitted here for simplicity in
        the hackathon timeframe, but straightforward to add if needed).
    """
    H = G.copy()
    degree2_nodes = {n for n, d in H.degree() if d == 2}

    visited = set()
    for start_node in list(degree2_nodes):
        if start_node in visited or start_node not in H:
            continue

        # Walk outward in both directions from this degree-2 node until we
        # hit a "real" node (degree != 2) on each side.
        chain = [start_node]
        visited.add(start_node)

        for direction in (0, 1):
            current = start_node
            prev = None
            while True:
                neighbors = [n for n in H.neighbors(current) if n != prev]
                if not neighbors:
                    break
                nxt = neighbors[0] if direction == 0 else neighbors[-1]
                if H.degree(nxt) != 2:
                    # Found the chain's real endpoint on this side.
                    if direction == 0:
                        chain.insert(0, nxt)
                    else:
                        chain.append(nxt)
                    break
                if nxt in visited:
                    break
                if direction == 0:
                    chain.insert(0, nxt)
                else:
                    chain.append(nxt)
                visited.add(nxt)
                prev, current = current, nxt

        if len(chain) < 3:
            continue  # nothing to collapse

        real_u, real_v = chain[0], chain[-1]
        if real_u == real_v or H.degree(real_u) == 2 or H.degree(real_v) == 2:
            continue  # malformed / cyclic chain -- skip for safety

        # Accumulate weight/length across the whole chain.
        total_weight = 0.0
        for a, b in zip(chain[:-1], chain[1:]):
            if H.has_edge(a, b):
                total_weight += H[a][b].get("weight", 1.0)

        interior = chain[1:-1]
        H.remove_nodes_from(interior)
        if not H.has_edge(real_u, real_v):
            H.add_edge(real_u, real_v, weight=max(total_weight, 1e-3),
                       length=total_weight, simplified=True)

    return H


# ---------------------------------------------------------------------------
# Strategy 1: Pivot-sampling approximate betweenness centrality
# ---------------------------------------------------------------------------
def approximate_betweenness_centrality(
    G: nx.Graph, k: int, weight: Optional[str] = "weight", seed: int = 42
) -> Dict:
    """
    Wraps nx.betweenness_centrality's built-in `k` pivot-sampling parameter.

    Samples k source nodes ("pivots") instead of all N, accumulates shortest
    path counts, then scales up. Complexity drops from O(N*M) to O(k*M)
    (unweighted) or O(k*M + k*N*logN) (weighted).
    """
    k = min(k, G.number_of_nodes())
    return nx.betweenness_centrality(G, k=k, normalized=True, weight=weight, seed=seed)


# ---------------------------------------------------------------------------
# Unified entry point
# ---------------------------------------------------------------------------
def compute_betweenness_centrality(
    G: nx.Graph,
    weight: Optional[str] = "weight",
    exact_threshold: int = 2000,
    approx_k: int = 250,
    simplify_first: bool = True,
) -> Dict:
    """
    Computes Betweenness Centrality with an automatic exact/approximate
    strategy switch suited to a 30-hour hackathon's time budget.

    Args:
        G: the healed road graph.
        weight: edge attribute to use as distance ('weight'/'length'), or
            None for unweighted (hop-count) centrality.
        exact_threshold: node-count cutoff below which EXACT Brandes'
            algorithm is used; above it, pivot-sampling approximation
            kicks in automatically.
        approx_k: number of pivot nodes to sample when approximating.
        simplify_first: whether to collapse degree-2 curvature chains
            before computing centrality (Strategy #2 -- cheap, recommended).

    Returns:
        dict[node_id -> normalized betweenness centrality score], keyed to
        node IDs in the (possibly simplified) graph used for computation.
    """
    if G.number_of_nodes() == 0:
        return {}

    working_graph = simplify_degree2_chains(G) if simplify_first else G

    n = working_graph.number_of_nodes()
    if n <= exact_threshold:
        # Exact Brandes' algorithm, as directly specified in the research.
        return nx.betweenness_centrality(working_graph, normalized=True, weight=weight)
    else:
        return approximate_betweenness_centrality(working_graph, k=approx_k, weight=weight)


def top_gatekeeper_nodes(centrality: Dict, top_n: int = 10):
    """Returns the top-N (node_id, score) pairs sorted by descending centrality
    -- these are the "Gatekeeper Nodes" for the criticality heatmap."""
    return sorted(centrality.items(), key=lambda kv: kv[1], reverse=True)[:top_n]


if __name__ == "__main__":
    # Sanity check on a small grid "road network".
    G = nx.grid_2d_graph(6, 6)
    G = nx.convert_node_labels_to_integers(G)
    nx.set_edge_attributes(G, 1.0, "weight")

    bc = compute_betweenness_centrality(G, exact_threshold=2000)
    top = top_gatekeeper_nodes(bc, top_n=5)
    print(f"[centrality.py self-test] Top-5 gatekeeper nodes: {top}")
