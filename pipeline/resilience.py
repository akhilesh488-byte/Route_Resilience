"""
resilience.py
==============
Structural resilience / stress-testing module, implementing research doc:
"mathematical formula for 'Global Network Efficiency' and pseudo-code for a
'Node Ablation' simulation".

Provides:
    - global_efficiency(): E(G) = (1/(N(N-1))) * sum_{i!=j} 1/d_ij
      (mathematically stable even when the network fragments -- unlike mean
      shortest path length, which -> infinity on disconnection)
    - run_dynamic_ablation(): sequential ("worst-case") node-ablation attack
      that recomputes betweenness centrality after every removal step and
      tracks the Giant Connected Component (GCC) fraction + Global
      Efficiency trajectory.
    - resilience_index(): Area-Under-Curve of the GCC fraction curve via
      trapezoidal integration -- summarizes the whole collapse profile into
      a single R in [0, 0.5].
    - run_static_ablation(): cheaper one-shot variant (centrality computed
      once on the intact graph) for quick hackathon demo iteration.
"""

from typing import Dict, List

import networkx as nx
import numpy as np


def _trapezoidal_integral(y_values: List[float], x_values: List[float]) -> float:
    """
    Trapezoidal-rule numerical integration for the Resilience Index (Area
    Under the GCC Curve). Uses np.trapezoid when available (NumPy >= 2.0)
    and falls back to the deprecated np.trapz on older NumPy installs, so
    the pipeline is robust to whatever NumPy version a hackathon machine
    happens to have.
    """
    integrator = getattr(np, "trapezoid", None) or np.trapz
    return float(integrator(y_values, x_values))


def global_efficiency(G: nx.Graph, weight: str = None) -> float:
    """
    E(G) = (1 / (N*(N-1))) * sum_{i != j} 1/d_ij

    Thin wrapper around NetworkX's built-in implementation, which already
    correctly treats disconnected pairs as contributing 0 (1/inf = 0), per
    the research spec. Exposed here (rather than calling nx directly
    everywhere) so weighting behavior stays consistent across the module.
    """
    if G.number_of_nodes() < 2:
        return 0.0
    return nx.global_efficiency(G)  # NetworkX computes on unweighted hop-distance by default


def _largest_cc_fraction(G: nx.Graph, original_n: int) -> float:
    """G(f) = |GCC(f)| / n, per the Giant Connected Component spec."""
    if G.number_of_nodes() == 0:
        return 0.0
    largest_cc = max(nx.connected_components(G), key=len)
    return len(largest_cc) / original_n


def run_dynamic_ablation(
    G_initial: nx.Graph, removal_fraction_step: float = 0.01, weight: str = None
) -> Dict:
    """
    Dynamic (sequential) targeted-attack simulation: recalculates
    betweenness centrality AFTER EVERY removal step, since as critical
    junctions collapse, traffic reroutes and previously-quiet roads can
    suddenly become high-centrality "bridges". This is the realistic,
    worst-case scenario the research doc recommends over static ablation.

    Args:
        G_initial: the healed road graph (will not be mutated -- a copy is
            used internally).
        removal_fraction_step: fraction of TOTAL nodes to remove per
            iteration (e.g. 0.01 = 1% per step). Larger steps = faster but
            coarser resolution on the collapse curve.
        weight: edge attribute for centrality/efficiency, or None for
            unweighted hop-distance (recommended default -- matches the
            research's reference implementation).

    Returns:
        dict with keys: removed_fractions, gcc_fractions,
        global_efficiencies, resilience_index, removed_node_order
    """
    G = G_initial.copy()
    total_nodes_n = G.number_of_nodes()
    if total_nodes_n == 0:
        return {
            "removed_fractions": [0.0], "gcc_fractions": [0.0],
            "global_efficiencies": [0.0], "resilience_index": 0.0,
            "removed_node_order": [],
        }

    removed_fractions = [0.0]
    gcc_fractions = [1.0]
    global_efficiencies = [global_efficiency(G, weight=weight)]
    removed_node_order: List = []

    step_size = max(1, int(total_nodes_n * removal_fraction_step))
    nodes_removed_counter = 0

    while G.number_of_nodes() > 1:
        # 1. Recompute centrality on the CURRENT (already-degraded) graph.
        centrality = nx.betweenness_centrality(G, normalized=True, weight=weight)

        # 2. Rank nodes by descending centrality; select this step's targets.
        sorted_nodes = sorted(centrality.items(), key=lambda item: item[1], reverse=True)
        nodes_to_remove = [node for node, _score in sorted_nodes[:step_size]]

        # 3. Remove the highest-centrality "gatekeeper" nodes.
        G.remove_nodes_from(nodes_to_remove)
        removed_node_order.extend(nodes_to_remove)
        nodes_removed_counter += len(nodes_to_remove)

        f = nodes_removed_counter / total_nodes_n
        removed_fractions.append(f)

        gcc_fractions.append(_largest_cc_fraction(G, total_nodes_n))
        global_efficiencies.append(
            global_efficiency(G, weight=weight) if G.number_of_nodes() > 1 else 0.0
        )

        if gcc_fractions[-1] == 0.0:
            break

    r_index = float(_trapezoidal_integral(gcc_fractions, removed_fractions))

    return {
        "removed_fractions": removed_fractions,
        "gcc_fractions": gcc_fractions,
        "global_efficiencies": global_efficiencies,
        "resilience_index": r_index,
        "removed_node_order": removed_node_order,
    }


def run_static_ablation(
    G_initial: nx.Graph, removal_fraction_step: float = 0.01, weight: str = None
) -> Dict:
    """
    Static (non-sequential) targeted attack: centrality is computed ONCE on
    the intact network, and nodes are removed strictly in that predefined
    order. Computationally much cheaper than the dynamic variant (a single
    centrality computation vs. one per step) -- useful for rapid iteration
    during a hackathon demo, though the research notes it's a less
    realistic "worst case" since it ignores traffic rerouting.
    """
    G = G_initial.copy()
    total_nodes_n = G.number_of_nodes()
    if total_nodes_n == 0:
        return {
            "removed_fractions": [0.0], "gcc_fractions": [0.0],
            "global_efficiencies": [0.0], "resilience_index": 0.0,
            "removed_node_order": [],
        }

    # Centrality computed ONCE, up front.
    centrality = nx.betweenness_centrality(G, normalized=True, weight=weight)
    ranked_nodes = [n for n, _s in sorted(centrality.items(), key=lambda kv: kv[1], reverse=True)]

    removed_fractions = [0.0]
    gcc_fractions = [1.0]
    global_efficiencies = [global_efficiency(G, weight=weight)]

    step_size = max(1, int(total_nodes_n * removal_fraction_step))

    for i in range(0, len(ranked_nodes), step_size):
        batch = ranked_nodes[i:i + step_size]
        G.remove_nodes_from(batch)

        f = min(1.0, (i + len(batch)) / total_nodes_n)
        removed_fractions.append(f)
        gcc_fractions.append(_largest_cc_fraction(G, total_nodes_n))
        global_efficiencies.append(
            global_efficiency(G, weight=weight) if G.number_of_nodes() > 1 else 0.0
        )

        if gcc_fractions[-1] == 0.0:
            break

    r_index = float(_trapezoidal_integral(gcc_fractions, removed_fractions))

    return {
        "removed_fractions": removed_fractions,
        "gcc_fractions": gcc_fractions,
        "global_efficiencies": global_efficiencies,
        "resilience_index": r_index,
        "removed_node_order": ranked_nodes,
    }


def simulate_single_node_failure(G: nx.Graph, node_id, weight: str = None) -> Dict:
    """
    Interactive "click a node to disable it" simulation for the Phase IV
    dashboard: removes ONE user-selected node and reports the before/after
    impact -- rerouting effects (GCC change) and travel-time/efficiency
    degradation, as required by the "Simulation Toggle" outcome.
    """
    if node_id not in G:
        raise ValueError(f"Node {node_id!r} not found in graph.")

    n = G.number_of_nodes()
    eff_before = global_efficiency(G, weight=weight)
    gcc_before = _largest_cc_fraction(G, n)

    G_after = G.copy()
    G_after.remove_node(node_id)

    eff_after = global_efficiency(G_after, weight=weight) if G_after.number_of_nodes() > 1 else 0.0
    gcc_after = _largest_cc_fraction(G_after, n)

    return {
        "node_id": node_id,
        "global_efficiency_before": eff_before,
        "global_efficiency_after": eff_after,
        "efficiency_drop_pct": 100.0 * (eff_before - eff_after) / eff_before if eff_before > 0 else 0.0,
        "gcc_fraction_before": gcc_before,
        "gcc_fraction_after": gcc_after,
    }


if __name__ == "__main__":
    grid = nx.convert_node_labels_to_integers(nx.grid_2d_graph(8, 8))
    nx.set_edge_attributes(grid, 1.0, "weight")

    results = run_dynamic_ablation(grid, removal_fraction_step=0.05)
    print(f"[resilience.py self-test] Resilience Index (dynamic): "
          f"{results['resilience_index']:.4f}  |  steps: {len(results['removed_fractions'])}")
