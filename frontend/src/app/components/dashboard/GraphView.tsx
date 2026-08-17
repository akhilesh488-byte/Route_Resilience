/**
 * GraphView.tsx
 * =============
 * Renders a GraphData payload (nodes with pixel coords + edges, optionally
 * flagged 'healed') as an SVG. Used for the Raw Topology / Healed Graph
 * pipeline panels and the What-If before/after mini-graphs.
 *
 * The viewBox matches the source image's pixel dimensions 1:1, so node
 * positions from the backend need zero client-side transformation.
 */

import type { GraphData } from "../../lib/api";

interface GraphViewProps {
  graph: GraphData;
  width: number;   // source image width in px (viewBox size)
  height: number;  // source image height in px (viewBox size)
  edgeColor?: string;
  healedEdgeColor?: string;
  nodeColor?: string;
  highlightNodeIds?: string[];
  highlightColor?: string;
  removedNodeId?: string; // draws this node as a red "X" instead of a dot
  backgroundImageUrl?: string;
  dim?: boolean; // slightly fade the background image (matches original overlay style)
}

export function GraphView({
  graph,
  width,
  height,
  edgeColor = "#475569",
  healedEdgeColor = "#22D3EE",
  nodeColor = "#EF4444",
  highlightNodeIds = [],
  highlightColor = "#F59E0B",
  removedNodeId,
  backgroundImageUrl,
  dim = true,
}: GraphViewProps) {
  const highlightSet = new Set(highlightNodeIds);
  const nodeById = new Map(graph.nodes.map((n) => [n.id, n]));

  // Node radius scales with image size (so dots aren't microscopic on a
  // 1024px tile) and gently with degree so junctions read as "bigger" than
  // plain pass-through points, echoing the original mock's styling.
  const scale = Math.max(width, height) / 300; // "300px" is the reference design size
  const radiusFor = (degree: number) => (2 + Math.min(degree, 5) * 0.7) * scale;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {backgroundImageUrl && (
        <>
          <img
            src={backgroundImageUrl}
            alt=""
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", opacity: dim ? 0.55 : 1,
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />
        </>
      )}
      <svg
        viewBox={`0 0 ${Math.max(width, 1)} ${Math.max(height, 1)}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {graph.edges.map((e, i) => {
          const source = nodeById.get(e.source);
          const target = nodeById.get(e.target);
          if (!source || !target) return null;
          return (
            <line
              key={`e-${i}`}
              x1={source.x} y1={source.y} x2={target.x} y2={target.y}
              stroke={e.healed ? healedEdgeColor : edgeColor}
              strokeWidth={e.healed ? scale * 1.8 : scale * 0.9}
              strokeLinecap="round"
              opacity={e.healed ? 0.95 : 0.85}
            />
          );
        })}
        {graph.nodes.map((n) => {
          const isRemoved = removedNodeId === n.id;
          const isHighlighted = highlightSet.has(n.id);
          if (isRemoved) {
            const r = scale * 6;
            return (
              <g key={`n-${n.id}`}>
                <line x1={n.x - r} y1={n.y - r} x2={n.x + r} y2={n.y + r} stroke="#EF4444" strokeWidth={r * 0.35} strokeLinecap="round" />
                <line x1={n.x - r} y1={n.y + r} x2={n.x + r} y2={n.y - r} stroke="#EF4444" strokeWidth={r * 0.35} strokeLinecap="round" />
              </g>
            );
          }
          return (
            <circle
              key={`n-${n.id}`}
              cx={n.x} cy={n.y}
              r={radiusFor(n.degree)}
              fill={isHighlighted ? highlightColor : nodeColor}
              opacity={isHighlighted ? 1 : 0.85}
            />
          );
        })}
      </svg>
    </div>
  );
}
