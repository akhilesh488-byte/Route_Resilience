/**
 * KpiRow.tsx
 * ==========
 * Professional six-card executive KPI summary row displaying critical topology
 * metrics, efficiency scores, and resilience indices.
 */

import {
  Waypoints,
  GitFork,
  TrendingUp,
  ShieldCheck,
  Zap,
  Network,
  ArrowUpRight,
} from "lucide-react";
import { usePipeline } from "../../state/PipelineContext";

interface KpiCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  accentBg: string;
  accentText: string;
  badge?: string;
  badgeType?: "positive" | "neutral" | "warning";
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  accentBg,
  accentText,
  badge,
  badgeType = "neutral",
}: KpiCardProps) {
  return (
    <div className="bg-white flex flex-col justify-between p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm transition-shadow min-w-0">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-tight">
          {label}
        </span>
        <div className={`p-2 rounded-xl ${accentBg} ${accentText} shrink-0`}>
          <Icon size={16} strokeWidth={2.2} />
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-2">
        <div className="flex items-baseline gap-2">
          <span className="font-mono font-extrabold text-[22px] text-slate-900 tracking-tight">
            {value}
          </span>
          {badge && (
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                badgeType === "positive"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : badgeType === "warning"
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="text-[11.5px] text-slate-500 font-medium truncate">{sub}</p>
      </div>
    </div>
  );
}

const fmtPct = (v: number | undefined | null) =>
  v === undefined || v === null ? "—" : `+${v.toFixed(1)}%`;
const fmtNum = (v: number | undefined | null) =>
  v === undefined || v === null ? "—" : v.toLocaleString();
const fmt3 = (v: number | undefined | null) =>
  v === undefined || v === null ? "—" : v.toFixed(3);

export function KpiRow() {
  const { result } = usePipeline();
  const k = result?.summary.kpis;
  const addedEdges = result?.summary.healed_edges_added;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5 w-full">
      <KpiCard
        icon={Waypoints}
        label="Network Nodes"
        value={fmtNum(k?.total_nodes)}
        sub="Intersections & dead-ends"
        accentBg="bg-slate-100"
        accentText="text-slate-700"
      />

      <KpiCard
        icon={Network}
        label="Road Segments"
        value={fmtNum(k?.total_edges)}
        sub={addedEdges ? `${addedEdges} healed bridges` : "Routable connections"}
        accentBg="bg-teal-50"
        accentText="text-teal-700"
        badge={addedEdges ? `+${addedEdges} links` : undefined}
        badgeType="positive"
      />

      <KpiCard
        icon={TrendingUp}
        label="Connectivity Gain"
        value={fmtPct(k?.connectivity_ratio_pct)}
        sub="Largest Connected Component"
        accentBg="bg-emerald-50"
        accentText="text-emerald-700"
        badge={k?.connectivity_ratio_pct ? "MST Healed" : undefined}
        badgeType="positive"
      />

      <KpiCard
        icon={Zap}
        label="Global Efficiency"
        value={fmt3(k?.global_efficiency)}
        sub="Harmonic path length E(G)"
        accentBg="bg-amber-50"
        accentText="text-amber-700"
      />

      <KpiCard
        icon={ShieldCheck}
        label="Resilience Index"
        value={fmt3(k?.resilience_index)}
        sub="AUC under targeted attack"
        accentBg="bg-emerald-50"
        accentText="text-emerald-700"
        badge={k?.resilience_index ? (k.resilience_index > 0.4 ? "High" : "Fragile") : undefined}
        badgeType={k?.resilience_index && k.resilience_index > 0.4 ? "positive" : "warning"}
      />

      <KpiCard
        icon={GitFork}
        label="Peak Centrality"
        value={fmt3(k?.max_betweenness_centrality)}
        sub="Max gatekeeper stress score"
        accentBg="bg-rose-50"
        accentText="text-rose-700"
      />
    </div>
  );
}
