/**
 * WhatIfPanel.tsx
 * ================
 * Interactive disaster simulation sandbox for evaluating civil infrastructure disruption.
 * Allows engineers to test what happens to overall city network efficiency and connectivity
 * when a specific bridge, intersection, or gatekeeper junction is severed.
 */

import { useEffect } from "react";
import { Zap, Loader2, ArrowRight, AlertOctagon, TrendingDown, Layers } from "lucide-react";
import { usePipeline } from "../../state/PipelineContext";
import { fileUrl } from "../../lib/api";
import { GraphView } from "./GraphView";

export function WhatIfPanel() {
  const {
    result,
    selectedNodeId,
    setSelectedNodeId,
    whatIf,
    whatIfLoading,
    whatIfError,
    runWhatIf,
  } = usePipeline();

  const nodes = result?.centrality.top_nodes ?? [];

  useEffect(() => {
    if (result && selectedNodeId) {
      runWhatIf(selectedNodeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, selectedNodeId]);

  if (!result) {
    return (
      <div className="bg-white flex flex-col justify-between gap-3.5 p-5 rounded-2xl border border-slate-200 shadow-xs flex-1 min-w-[340px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[14.5px] text-slate-900">
              What-If Failure Simulation
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
              STRESS TEST
            </span>
          </div>
          <Zap size={16} className="text-purple-600" />
        </div>

        <div className="py-16 flex flex-col items-center justify-center gap-1.5 text-slate-400 select-none">
          <AlertOctagon size={22} className="text-slate-300" />
          <span className="text-[12px] font-medium">Run pipeline to enable failure simulator</span>
        </div>

        <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          Simulate bridge/junction collapse impact on mobility
        </div>
      </div>
    );
  }

  const { width, height } = result.summary.image;
  const inputUrl = fileUrl(result.files.input_image);
  const impact = whatIf?.impact;

  return (
    <div className="bg-white flex flex-col justify-between gap-3.5 p-5 rounded-2xl border border-slate-200 shadow-xs flex-1 min-w-[340px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[14.5px] text-slate-900">
              What-If Failure Simulation
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
              SANDBOX
            </span>
          </div>
          <p className="text-[11.5px] text-slate-500">
            Simulate localized flood, collapse, or blockade at chosen junction
          </p>
        </div>
        <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
          <Zap size={16} />
        </div>
      </div>

      {/* Target Selector & Trigger Button */}
      <div className="flex items-center gap-2">
        <select
          value={selectedNodeId ?? ""}
          onChange={(e) => setSelectedNodeId(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[12px] font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
        >
          {nodes.map((n) => (
            <option key={n.node_id} value={n.node_id}>
              Junction #{n.node_id} (Centrality: {n.score.toFixed(3)})
            </option>
          ))}
        </select>

        <button
          onClick={() => selectedNodeId && runWhatIf(selectedNodeId)}
          disabled={whatIfLoading || !selectedNodeId}
          className="bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-60 text-white text-[12px] font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0 shadow-xs transition-all"
        >
          {whatIfLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <AlertOctagon size={14} />
          )}
          <span>Ablate</span>
        </button>
      </div>

      {whatIfError && <p className="text-[11px] text-rose-600 font-medium">{whatIfError}</p>}

      {whatIf && (
        <div className="flex flex-col gap-3">
          {/* Side-by-side Before/After Previews */}
          <div className="flex items-center gap-2">
            {/* Before (Intact) */}
            <div className="flex-1 aspect-square rounded-xl overflow-hidden bg-slate-950 relative border border-slate-200">
              <GraphView
                graph={whatIf.before_graph}
                width={width}
                height={height}
                backgroundImageUrl={inputUrl}
                edgeColor="#64748b"
                healedEdgeColor="#10b981"
                nodeColor="#38bdf8"
                removedNodeId={undefined}
              />
              <span className="absolute bottom-1.5 left-1.5 bg-slate-900/80 backdrop-blur-xs text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded">
                INTACT
              </span>
            </div>

            <div className="flex flex-col items-center justify-center px-0.5">
              <ArrowRight size={16} className="text-slate-400" />
            </div>

            {/* After (Node Severed) */}
            <div className="flex-1 aspect-square rounded-xl overflow-hidden bg-slate-950 relative border border-slate-200">
              <GraphView
                graph={whatIf.before_graph}
                width={width}
                height={height}
                backgroundImageUrl={inputUrl}
                edgeColor="#475569"
                healedEdgeColor="#10b981"
                nodeColor="#64748b"
                removedNodeId={whatIf.node_id}
              />
              <span className="absolute bottom-1.5 left-1.5 bg-rose-900/90 backdrop-blur-xs text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded">
                DISRUPTED
              </span>
            </div>
          </div>

          {/* Impact Tiles */}
          {impact && (
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl p-2.5 bg-rose-50 border border-rose-100 flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] uppercase font-bold text-rose-800 tracking-wider">
                    Efficiency Drop
                  </span>
                  <TrendingDown size={12} className="text-rose-600" />
                </div>
                <span className="font-mono font-extrabold text-[16px] text-rose-700">
                  {impact.efficiency_drop_pct >= 0 ? "−" : "+"}
                  {Math.abs(impact.efficiency_drop_pct).toFixed(1)}%
                </span>
                <span className="text-[10px] text-rose-600 font-medium">
                  {impact.efficiency_drop_pct > 5 ? "Critical loss" : "Manageable rerouting"}
                </span>
              </div>

              <div className="rounded-xl p-2.5 bg-amber-50 border border-amber-100 flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] uppercase font-bold text-amber-800 tracking-wider">
                    Retained Cluster
                  </span>
                  <Layers size={12} className="text-amber-600" />
                </div>
                <span className="font-mono font-extrabold text-[16px] text-amber-800">
                  {(impact.gcc_fraction_after * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-amber-700 font-medium">
                  Remaining largest component
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
        <span>Targeted node: Junction #{selectedNodeId ?? "—"}</span>
        <span className="font-mono text-[10px] text-rose-600 font-bold uppercase">
          Single-point Failure
        </span>
      </div>
    </div>
  );
}
