/**
 * BottomSummaryBar.tsx
 * =====================
 * Executive intelligence summary strip and GIS/QGIS interoperability export actions.
 */

import { Download, FileJson, CircleDot, Minus, CheckCircle, ShieldCheck } from "lucide-react";
import { usePipeline } from "../../state/PipelineContext";
import { api } from "../../lib/api";

export function BottomSummaryBar() {
  const { result } = usePipeline();

  const summaryText = result
    ? `Topological reconstruction produced a ${result.raw_graph.node_count}-node road network. Kruskal-style MST + Disjoint-Set healing bridged ` +
      `${result.summary.healed_edges_added} canopy occlusion gap${result.summary.healed_edges_added === 1 ? "" : "s"}, ` +
      `improving network connectivity by +${result.summary.kpis.connectivity_ratio_pct.toFixed(1)}%. ` +
      `Targeted dynamic node ablation establishes a global Resilience Index of ${result.summary.kpis.resilience_index.toFixed(3)}.`
    : "Upload high-resolution satellite imagery or a binary road mask (or click 'Run Demo Sample') to analyze road network resilience.";

  return (
    <footer className="bg-white flex flex-col md:flex-row items-center justify-between gap-4 p-4.5 rounded-2xl border border-slate-200 shadow-xs w-full">
      {/* Executive Report Summary */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 flex-1 min-w-0">
        <div className="flex items-start gap-2.5 flex-1">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 mt-0.5 shrink-0">
            <ShieldCheck size={16} />
          </div>
          <p className="text-[12.5px] text-slate-600 leading-relaxed font-normal">
            {summaryText}
          </p>
        </div>

        {/* Legend Indicators */}
        <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Healed Bridge
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-slate-500" /> Intact Road
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Gatekeeper Node
          </span>
        </div>
      </div>

      {/* GIS & JSON Export Actions */}
      <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
        <a
          href={result ? api.exportGexfUrl(result.job_id) : undefined}
          aria-disabled={!result}
          onClick={(e) => !result && e.preventDefault()}
          download
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[12.5px] font-semibold transition-all ${
            result
              ? "border-slate-200 text-slate-800 bg-white hover:bg-slate-50 active:bg-slate-100 shadow-xs"
              : "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed"
          }`}
          title="Export vector graph formatted for QGIS and Gephi"
        >
          <Download size={15} />
          <span>Export GEXF (QGIS)</span>
        </a>

        <a
          href={result ? api.exportReportUrl(result.job_id) : undefined}
          aria-disabled={!result}
          onClick={(e) => !result && e.preventDefault()}
          download
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold transition-all ${
            result
              ? "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 shadow-xs"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
          title="Download complete JSON technical audit report"
        >
          <FileJson size={15} />
          <span>JSON Audit Report</span>
        </a>
      </div>
    </footer>
  );
}
