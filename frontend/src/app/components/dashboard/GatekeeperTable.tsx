/**
 * GatekeeperTable.tsx
 * ====================
 * Ranked table of structural bottleneck nodes sorted by Betweenness Centrality.
 * Clicking a row targets that node for single-point failure ablation in the What-If sandbox.
 */

import { useState } from "react";
import { Crosshair, Search, GitFork, AlertTriangle, ArrowRight } from "lucide-react";
import { usePipeline } from "../../state/PipelineContext";

export function GatekeeperTable() {
  const { result, selectedNodeId, setSelectedNodeId } = usePipeline();
  const [searchTerm, setSearchTerm] = useState("");

  const nodes = result?.centrality.top_nodes ?? [];
  const maxScore = nodes[0]?.score ?? 1;

  const filteredNodes = nodes.filter((n) =>
    `Node_${n.node_id}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.node_id.includes(searchTerm)
  );

  return (
    <div className="bg-white flex flex-col justify-between gap-3.5 p-5 rounded-2xl border border-slate-200 shadow-xs flex-1 min-w-[340px]">
      {/* Header & Search */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[14.5px] text-slate-900">
              Gatekeeper Bottlenecks
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              BETWEENNESS
            </span>
          </div>

          <span className="text-[11px] font-semibold text-slate-500">
            {nodes.length} Key Nodes
          </span>
        </div>

        {/* Quick Search */}
        {nodes.length > 0 && (
          <div className="relative w-full">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search junction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11.5px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
            />
          </div>
        )}
      </div>

      {/* Table Body */}
      <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-1">
        {nodes.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center gap-1.5 text-slate-400 select-none">
            <GitFork size={20} className="text-slate-300" />
            <span className="text-[12px] font-medium">Awaiting pipeline run</span>
          </div>
        ) : filteredNodes.length === 0 ? (
          <p className="text-[12px] text-slate-400 py-6 text-center">No matching nodes found.</p>
        ) : (
          filteredNodes.map((n) => {
            const active = selectedNodeId === n.node_id;
            const barPct = maxScore > 0 ? (n.score / maxScore) * 100 : 0;
            const isTop3 = n.rank <= 3;

            return (
              <button
                key={n.node_id}
                onClick={() => setSelectedNodeId(n.node_id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all border ${
                  active
                    ? "bg-amber-50/80 border-amber-300 shadow-xs"
                    : "bg-slate-50/50 hover:bg-slate-100/80 border-transparent"
                }`}
              >
                {/* Rank Badge */}
                <span
                  className={`font-mono text-[10.5px] font-bold w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    n.rank === 1
                      ? "bg-amber-500 text-white"
                      : n.rank === 2
                      ? "bg-slate-400 text-white"
                      : n.rank === 3
                      ? "bg-amber-700/70 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  #{n.rank}
                </span>

                {/* Node Details & Progress Bar */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-[12px] text-slate-900 truncate">
                      Junction_{n.node_id}
                    </span>
                    <span className="font-mono font-bold text-[11.5px] text-amber-800 shrink-0">
                      {n.score.toFixed(4)}
                    </span>
                  </div>

                  <div className="h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(8, barPct)}%` }}
                    />
                  </div>
                </div>

                {/* Active Indicator */}
                {active ? (
                  <Crosshair size={15} className="text-amber-600 shrink-0 animate-pulse" />
                ) : (
                  <ArrowRight size={13} className="text-slate-300 shrink-0" />
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
        <span>Click any row to test in What-If simulator</span>
        {selectedNodeId && (
          <span className="font-mono text-amber-700 font-semibold">
            Target: #{selectedNodeId}
          </span>
        )}
      </div>
    </div>
  );
}
