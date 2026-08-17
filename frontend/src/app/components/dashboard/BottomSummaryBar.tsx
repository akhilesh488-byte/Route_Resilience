/**
 * BottomSummaryBar.tsx
 * =====================
 * Plain-language summary of the run plus the two export actions:
 *   - Export Graph (GEXF)  -> GET /jobs/{id}/export/gexf  (open in QGIS/Gephi)
 *   - Download Report      -> GET /jobs/{id}/export/report (JSON summary)
 */

import { Download, FileJson, CircleDot, Minus } from "lucide-react";
import { usePipeline } from "../../state/PipelineContext";
import { api } from "../../lib/api";

export function BottomSummaryBar() {
  const { result } = usePipeline();

  const summaryText = result
    ? `Segmentation produced a ${result.raw_graph.node_count}-node topology; MST + Disjoint-Set healing added ` +
      `${result.summary.healed_edges_added} bridging edge${result.summary.healed_edges_added === 1 ? "" : "s"}, ` +
      `lifting the largest connected component by ${result.summary.kpis.connectivity_ratio_pct.toFixed(1)}%. ` +
      `Dynamic betweenness ablation yields a Resilience Index of ${result.summary.kpis.resilience_index.toFixed(3)}.`
    : "Upload a satellite tile or a precomputed mask to generate a routable topology and resilience report.";

  return (
    <div className="bg-white flex items-center justify-between gap-4 p-4 rounded-xl border border-[#e2e8f0] w-full flex-wrap">
      <div className="flex items-center gap-4 flex-1 min-w-[280px]">
        <p className="text-[12px] text-[#475569] flex-1">{summaryText}</p>
        <div className="flex items-center gap-3 shrink-0 text-[10px] text-[#94a3b8]">
          <span className="flex items-center gap-1"><CircleDot size={10} className="text-[#10b981]" /> Healed edge</span>
          <span className="flex items-center gap-1"><Minus size={10} className="text-[#94a3b8]" /> Original edge</span>
          <span className="flex items-center gap-1"><CircleDot size={10} className="text-[#f59e0b]" /> Gatekeeper node</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <a
          href={result ? api.exportGexfUrl(result.job_id) : undefined}
          aria-disabled={!result}
          onClick={(e) => !result && e.preventDefault()}
          download
          className={`flex items-center gap-2 px-3.5 py-2 rounded-md border text-[12px] font-semibold ${
            result ? "border-[#e2e8f0] text-[#0f172a] hover:bg-[#f8fafc]" : "border-[#e2e8f0] text-[#cbd5e1] cursor-not-allowed"
          }`}
        >
          <Download size={14} />
          Export Graph (GEXF)
        </a>
        <a
          href={result ? api.exportReportUrl(result.job_id) : undefined}
          aria-disabled={!result}
          onClick={(e) => !result && e.preventDefault()}
          download
          className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-[12px] font-semibold ${
            result ? "bg-[#0f172a] text-white hover:bg-[#1e293b]" : "bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed"
          }`}
        >
          <FileJson size={14} />
          Download Report
        </a>
      </div>
    </div>
  );
}
