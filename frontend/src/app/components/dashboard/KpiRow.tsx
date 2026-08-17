/**
 * KpiRow.tsx
 * ==========
 * Six top-line metric cards. Values come straight from
 * PipelineSummary.kpis (backend/app.py `_build_summary`). Renders sensible
 * placeholders before any run has completed.
 */

import { Network, Waypoints, Gauge, ShieldCheck, TrendingUp, Percent } from "lucide-react";
import { usePipeline } from "../../state/PipelineContext";

interface KpiCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
  sub?: string;
}

function KpiCard({ icon: Icon, label, value, accent, sub }: KpiCardProps) {
  return (
    <div className="bg-white flex flex-col gap-2 p-4 rounded-xl border border-[#e2e8f0] min-w-0">
      <div className="flex items-start justify-between gap-1">
        <p className="text-[10.5px] font-semibold text-[#94a3b8] uppercase tracking-wide leading-tight">{label}</p>
        <Icon size={16} style={{ color: accent }} className="shrink-0 mt-0.5" />
      </div>
      <p className="font-mono font-bold text-[22px] text-[#0f172a]">{value}</p>
      {sub && <p className="text-[10px] text-[#94a3b8] truncate">{sub}</p>}
    </div>
  );
}

const fmtPct = (v: number | undefined | null) => (v === undefined || v === null ? "—" : `${v.toFixed(1)}%`);
const fmtNum = (v: number | undefined | null) => (v === undefined || v === null ? "—" : v.toLocaleString());
const fmt3 = (v: number | undefined | null) => (v === undefined || v === null ? "—" : v.toFixed(3));

export function KpiRow() {
  const { result } = usePipeline();
  const k = result?.summary.kpis;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 w-full">
      <KpiCard icon={Waypoints} label="Total Nodes" value={fmtNum(k?.total_nodes)} accent="#3b82f6" sub="Intersections & endpoints" />
      <KpiCard icon={Network} label="Total Edges" value={fmtNum(k?.total_edges)} accent="#8b5cf6" sub="Healed road segments" />
      <KpiCard icon={Percent} label="Connectivity Gain" value={fmtPct(k?.connectivity_ratio_pct)} accent="#10b981" sub="After MST healing" />
      <KpiCard icon={Gauge} label="Global Efficiency" value={fmt3(k?.global_efficiency)} accent="#f59e0b" sub="E(G), 0–1 scale" />
      <KpiCard icon={ShieldCheck} label="Resilience Index" value={fmt3(k?.resilience_index)} accent="#0d9488" sub="AUC of GCC curve" />
      <KpiCard icon={TrendingUp} label="Peak Betweenness" value={fmt3(k?.max_betweenness_centrality)} accent="#ef4444" sub="Top gatekeeper node" />
    </div>
  );
}
