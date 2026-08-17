/**
 * GraphView.tsx
 * =============
 * High-precision SVG road topology visualizer.
 * Renders nodes (intersections) and edges (road segments & healed links)
 * directly aligned to the source satellite/mask pixel coordinate frame.
 */

import type { GraphData } from "../../lib/api";

interface GraphViewProps {
  graph: GraphData;
  width: number;
  height: number;
  edgeColor?: string;
  healedEdgeColor?: string;
  nodeColor?: string;
  highlightNodeIds?: string[];
  highlightColor?: string;
  removedNodeId?: string;
  backgroundImageUrl?: string;
  dim?: boolean;
}

export function GraphView({
  graph,
  width,
  height,
  edgeColor = "#475569",
  healedEdgeColor = "#10b981",
  nodeColor = "#0f172a",
  highlightNodeIds = [],
  highlightColor = "#f59e0b",
  removedNodeId,
  backgroundImageUrl,
  dim = true,
}: GraphViewProps) {
  const highlightSet = new Set(highlightNodeIds);
  const nodeById = new Map(graph.nodes.map((n) => [n.id, n]));

  // Visual scaling relative to image dimension
  const scale = Math.max(width, height) / 320;
  const radiusFor = (degree: number) => Math.max(1.8, (2 + Math.min(degree, 4) * 0.8) * scale);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center select-none">
      {/* Background satellite / mask overlay */}
      {backgroundImageUrl ? (
        <>
          <img
            src={backgroundImageUrl}
            alt="Source tile"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: dim ? 0.45 : 1 }}
          />
          <div className="absolute inset-0 bg-slate-950/40" />
        </>
      ) : (
        /* Subtle architectural grid pattern */
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />
      )}

      {/* Vector Graph SVG */}
      <svg
        viewBox={`0 0 ${Math.max(width, 1)} ${Math.max(height, 1)}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <filter id="glow-healed" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Regular Edges */}
        {graph.edges
          .filter((e) => !e.healed)
          .map((e, i) => {
            const source = nodeById.get(e.source);
            const target = nodeById.get(e.target);
            if (!source || !target) return null;
            return (
              <line
                key={`e-reg-${i}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={edgeColor}
                strokeWidth={Math.max(1, scale * 1.2)}
                strokeLinecap="round"
                opacity={0.85}
              />
            );
          })}

        {/* Healed Bridging Edges (Emerald Highlighted) */}
        {graph.edges
          .filter((e) => e.healed)
          .map((e, i) => {
            const source = nodeById.get(e.source);
            const target = nodeById.get(e.target);
            if (!source || !target) return null;
            return (
              <g key={`e-healed-${i}`}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={healedEdgeColor}
                  strokeWidth={Math.max(2, scale * 2.4)}
                  strokeLinecap="round"
                  strokeDasharray="4 2"
                  filter="url(#glow-healed)"
                  opacity={0.95}
                />
              </g>
            );
          })}

        {/* Nodes */}
        {graph.nodes.map((n) => {
          const isRemoved = removedNodeId === n.id;
          const isHighlighted = highlightSet.has(n.id);

          if (isRemoved) {
            const r = scale * 5.5;
            return (
              <g key={`n-del-${n.id}`}>
                {/* Red warning pulse circle */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r * 1.5}
                  fill="#dc2626"
                  opacity={0.3}
                />
                {/* Red X */}
                <line
                  x1={n.x - r}
                  y1={n.y - r}
                  x2={n.x + r}
                  y2={n.y + r}
                  stroke="#ef4444"
                  strokeWidth={r * 0.4}
                  strokeLinecap="round"
                />
                <line
                  x1={n.x - r}
                  y1={n.y + r}
                  x2={n.x + r}
                  y2={n.y - r}
                  stroke="#ef4444"
                  strokeWidth={r * 0.4}
                  strokeLinecap="round"
                />
              </g>
            );
          }

          const radius = radiusFor(n.degree);
          return (
            <g key={`n-${n.id}`}>
              {isHighlighted && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={radius * 1.8}
                  fill={highlightColor}
                  opacity={0.35}
                />
              )}
              <circle
                cx={n.x}
                cy={n.y}
                r={radius}
                fill={isHighlighted ? highlightColor : nodeColor}
                stroke="#ffffff"
                strokeWidth={Math.max(0.6, scale * 0.6)}
                opacity={isHighlighted ? 1 : 0.9}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
