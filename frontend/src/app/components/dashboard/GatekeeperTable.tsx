/**
 * GatekeeperTable.tsx
 * ====================
 * Ranked list of the highest-betweenness-centrality nodes ("Gatekeeper
 * Nodes" / structural bottlenecks) from the healed graph. Clicking a row
 * selects that node for the What-If single-node-failure panel.
 */

import { Crosshair } from "lucide-react";
import { usePipeline } from "../../state/PipelineContext";

export function GatekeeperTable() {
  const { result, selectedNodeId, setSelectedNodeId } = usePipeline();
  const nodes = result?.centrality.top_nodes ?? [];
  const maxScore = nodes[0]?.score ?? 1;

  return (
    <div className="bg-white flex flex-col gap-3 p-5 rounded-xl border border-[#e2e8f0] flex-1 min-w-[300px]">
      <div>
        <p className="font-bold text-[14px] text-[#0f172a]">Gatekeeper Nodes</p>
        <p className="text-[11px] text-[#94a3b8]">Ranked by betweenness centrality — click to inspect</p>
      </div>

      <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto pr-1">
        {nodes.length === 0 && (
          <p className="text-[12px] text-[#94a3b8] py-6 text-center">No graph yet — run the pipeline first.</p>
        )}
        {nodes.map((n) => {
          const active = selectedNodeId === n.node_id;
          const barPct = maxScore > 0 ? (n.score / maxScore) * 100 : 0;
          return (
            <button
              key={n.node_id}
              onClick={() => setSelectedNodeId(n.node_id)}
              className={`flex items-center gap-3 px-2.5 py-2 rounded-md text-left transition-colors ${
                active ? "bg-[#fef3c7]" : "hover:bg-[#f8fafc]"
              }`}
            >
              <span className="font-mono text-[10px] text-[#94a3b8] w-5 shrink-0">#{n.rank}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-[#0f172a] truncate">Node_{n.node_id}</span>
                  <span className="font-mono text-[11px] font-semibold text-[#0f172a] shrink-0">{n.score.toFixed(4)}</span>
                </div>
                <div className="h-1 bg-[#f1f5f9] rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: `${barPct}%` }} />
                </div>
              </div>
              {active && <Crosshair size={14} className="text-[#f59e0b] shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
