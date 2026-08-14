"""
graph_utils.py
==============
Helpers to turn NetworkX graphs (as produced by the pipeline) into
JSON-serializable dicts for the frontend, and to export a GEXF file that
QGIS/Gephi can open (per the problem statement's evaluation workflow).
"""

import io
from typing import Dict

import networkx as nx


def serialize_graph(G: nx.Graph) -> Dict:
    """
    Converts a pipeline graph (nodes with 'pos'=(x,y) in pixel space, edges
    optionally flagged 'healed') into a compact JSON structure the frontend
    can render directly into an SVG viewBox matching the source image's
    pixel dimensions -- no coordinate normalization needed on either side.
    """
    nodes = []
    for node_id, data in G.nodes(data=True):
        x, y = data.get("pos", (0.0, 0.0))
        nodes.append({
            "id": str(node_id),
            "x": float(x),
            "y": float(y),
            "degree": int(G.degree(node_id)),
        })

    edges = []
    for u, v, data in G.edges(data=True):
        edges.append({
            "source": str(u),
            "target": str(v),
            "healed": bool(data.get("healed", False)),
            "length": float(data.get("length", 0.0)),
        })

    return {
        "nodes": nodes,
        "edges": edges,
        "node_count": len(nodes),
        "edge_count": len(edges),
    }


def graph_to_gexf_bytes(G: nx.Graph) -> bytes:
    """
    Exports a graph to GEXF format, per the "Export Graph (GEXF)" button.

    GEXF's writer doesn't support list-typed attributes (like the 'pts'
    pixel-trail list we attach to edges in mask_to_graph.py), so this
    builds a cleaned copy retaining only scalar attributes before writing.
    """
    G_clean = nx.Graph()
    for node_id, data in G.nodes(data=True):
        x, y = data.get("pos", (0.0, 0.0))
        G_clean.add_node(str(node_id), x=float(x), y=float(y),
                          degree=int(G.degree(node_id)))

    for u, v, data in G.edges(data=True):
        G_clean.add_edge(
            str(u), str(v),
            weight=float(data.get("weight", 1.0)),
            length=float(data.get("length", 0.0)),
            healed=bool(data.get("healed", False)),
        )

    buffer = io.BytesIO()
    nx.write_gexf(G_clean, buffer)
    return buffer.getvalue()
