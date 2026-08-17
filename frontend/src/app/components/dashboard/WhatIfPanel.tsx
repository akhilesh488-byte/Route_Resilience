/**
 * WhatIfPanel.tsx
 * ================
 * "Click a node to disable it" simulator from the problem statement's
 * Phase IV dashboard spec. Picks up the node selected in GatekeeperTable
 * (or any node the user picks from the dropdown), calls
 * POST /jobs/{id}/whatif, and shows before/after mini graphs plus the real
 * efficiency/connectivity impact numbers.
 */

import { useEffect } from "react";
import { Zap, Loader2, ArrowRight } from "lucide-react";
import { usePipeline } from "../../state/PipelineContext";
import { fileUrl } from "../../lib/api";
import { GraphView } from "./GraphView";

export function WhatIfPanel() {
  const {
    result, selectedNodeId, setSelectedNodeId,
    whatIf, whatIfLoading, whatIfError, runWhatIf,
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
      <div className="bg-white flex flex-col gap-3 p-5 rounded-xl border border-[#e2e8f0] flex-1 min-w-[300px]">
        <p className="font-bold text-[14px] text-[#0f172a]">What-If: Node Failure Simulation</p>
        <p className="text-[12px] text-[#94a3b8] py-8 text-center">Run the pipeline to enable simulation.</p>
      </div>
    );
  }

  const { width, height } = result.summary.image;
  const inputUrl = fileUrl(result.files.input_image);
  const impact = whatIf?.impact;

  return (
    <div className="bg-white flex flex-col gap-4 p-5 rounded-xl border border-[#e2e8f0] flex-1 min-w-[300px]">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-[14px] text-[#0f172a]">What-If: Node Failure Simulation</p>
          <p className="text-[11px] text-[#94a3b8]">Simulate flooding/collapse at a chosen junction</p>
        </div>
        <Zap size={16} className="text-[#8b5cf6]" />
      </div>

      <div className="flex items-center gap-2">
        <select
          value={selectedNodeId ?? ""}
          onChange={(e) => setSelectedNodeId(e.target.value)}
          className="flex-1 border border-[#e2e8f0] rounded-md px-3 py-2 text-[12px] font-mono text-[#0f172a]"
        >
          {nodes.map((n) => (
            <option key={n.node_id} value={n.node_id}>
              Node_{n.node_id} (centrality {n.score.toFixed(3)})
            </option>
          ))}
        </select>
        <button
          onClick={() => selectedNodeId && runWhatIf(selectedNodeId)}
          disabled={whatIfLoading || !selectedNodeId}
          className="bg-[#8b5cf6] disabled:opacity-60 text-white text-[12px] font-semibold px-3 py-2 rounded-md flex items-center gap-1.5 shrink-0"
        >
          {whatIfLoading ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />}
          Ablate
        </button>
      </div>

      {whatIfError && <p className="text-[11px] text-[#ef4444]">{whatIfError}</p>}

      {whatIf && (
        <>
          <div className="flex items-center gap-2">
            <div className="flex-1 aspect-square rounded-lg overflow-hidden bg-[#0f172a] relative">
              <GraphView
                graph={whatIf.before_graph}
                width={width}
                height={height}
                backgroundImageUrl={inputUrl}
                edgeColor="#10b981"
                nodeColor="#10b981"
                removedNodeId={undefined}
              />
              <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">Before</span>
            </div>
            <ArrowRight size={16} className="text-[#94a3b8] shrink-0" />
            <div className="flex-1 aspect-square rounded-lg overflow-hidden bg-[#0f172a] relative">
              <GraphView
                graph={whatIf.before_graph}
                width={width}
                height={height}
                backgroundImageUrl={inputUrl}
                edgeColor="#334155"
                nodeColor="#334155"
                removedNodeId={whatIf.node_id}
              />
              <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">After</span>
            </div>
          </div>

          {impact && (
            <div className="grid grid-cols-2 gap-2">
              <div className={`rounded-md p-2.5 ${impact.efficiency_drop_pct >= 0 ? "bg-[#fef2f2]" : "bg-[#f0fdf4]"}`}>
                <p className={`text-[9px] uppercase font-semibold ${impact.efficiency_drop_pct >= 0 ? "text-[#991b1b]" : "text-[#166534]"}`}>
                  Efficiency {impact.efficiency_drop_pct >= 0 ? "Drop" : "Change"}
                </p>
                <p className={`font-mono font-bold text-[16px] ${impact.efficiency_drop_pct >= 0 ? "text-[#991b1b]" : "text-[#166534]"}`}>
                  {impact.efficiency_drop_pct >= 0 ? "−" : "+"}{Math.abs(impact.efficiency_drop_pct).toFixed(1)}%
                </p>
              </div>
              <div className="bg-[#fffbeb] rounded-md p-2.5">
                <p className="text-[9px] text-[#92400e] uppercase font-semibold">GCC After</p>
                <p className="font-mono font-bold text-[16px] text-[#92400e]">
                  {(impact.gcc_fraction_after * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
