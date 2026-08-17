/**
 * ResilienceChart.tsx
 * ====================
 * High-precision Recharts visualization of the targeted node ablation stress test.
 * Plots Giant Connected Component (GCC) retention and Global Network Efficiency decay
 * as high-centrality gatekeeper junctions are sequentially removed.
 */

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ShieldCheck, ShieldAlert, Activity, Info } from "lucide-react";
import { usePipeline } from "../../state/PipelineContext";

export function ResilienceChart() {
  const { result } = usePipeline();
  const ablation = result?.ablation;

  const data = ablation
    ? ablation.removed_fractions.map((f, i) => ({
        removed: Math.round(f * 1000) / 10,
        gcc: ablation.gcc_fractions[i],
        efficiency: ablation.global_efficiencies[i],
      }))
    : [];

  const rIndex = ablation?.resilience_index;
  const rating =
    rIndex === undefined
      ? null
      : rIndex >= 0.5
      ? { label: "High Resilience", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: ShieldCheck }
      : rIndex >= 0.25
      ? { label: "Moderate Resilience", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: ShieldAlert }
      : { label: "High Fragility", color: "text-rose-700", bg: "bg-rose-50 border-rose-200", icon: ShieldAlert };

  return (
    <div className="bg-white flex flex-col justify-between gap-4 p-5 rounded-2xl border border-slate-200 shadow-xs flex-1 min-w-[360px]">
      {/* Header & Rating Badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[14.5px] text-slate-900">
              Global Resilience Curve
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              DYNAMIC ABLATION
            </span>
          </div>
          <p className="text-[11.5px] text-slate-500">
            Network degradation under sequential gatekeeper failure
          </p>
        </div>

        {rating && (
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${rating.bg} shadow-xs shrink-0`}
          >
            <rating.icon size={16} className={rating.color} />
            <div className="flex flex-col">
              <span className={`font-mono font-extrabold text-[14px] leading-tight ${rating.color}`}>
                {rIndex?.toFixed(3)}
              </span>
              <span className={`text-[9.5px] font-semibold uppercase tracking-wider ${rating.color}`}>
                {rating.label}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chart Canvas */}
      <div className="h-[230px] w-full mt-2">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gccGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

              <XAxis
                dataKey="removed"
                tick={{ fontSize: 10, fill: "#64748b" }}
                unit="%"
                stroke="#cbd5e1"
                label={{
                  value: "% Nodes Ablated",
                  position: "insideBottom",
                  offset: -2,
                  fontSize: 10,
                  fill: "#94a3b8",
                }}
              />

              <YAxis
                tick={{ fontSize: 10, fill: "#64748b" }}
                domain={[0, 1]}
                stroke="#cbd5e1"
                tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              />

              <Tooltip
                formatter={(val: number, name: string) => [
                  `${(val * 100).toFixed(1)}%`,
                  name === "gcc" ? "Largest Cluster (GCC)" : "Global Efficiency",
                ]}
                labelFormatter={(l) => `Ablated ${l}% of nodes`}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  color: "#ffffff",
                  borderRadius: 10,
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)",
                  fontSize: 11,
                  padding: "8px 12px",
                }}
                itemStyle={{ color: "#e2e8f0" }}
              />

              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 4 }}
                iconType="circle"
                iconSize={8}
              />

              <Area
                type="monotone"
                dataKey="gcc"
                name="GCC Retention (Connectivity)"
                stroke="#059669"
                strokeWidth={2.2}
                fill="url(#gccGradient)"
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="efficiency"
                name="Network Routing Efficiency"
                stroke="#d97706"
                strokeWidth={2}
                strokeDasharray="4 3"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-slate-400 select-none bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <Activity size={22} className="text-slate-300" />
            <span className="text-[12px] font-medium">
              Run pipeline to compute stress tolerance curves
            </span>
          </div>
        )}
      </div>

      {/* Metric Caption */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1">
          <Info size={12} className="text-slate-400" /> Area under curve measures structural fault tolerance
        </span>
        <span className="font-mono text-slate-600 font-semibold">
          {data.length} Simulation Steps
        </span>
      </div>
    </div>
  );
}
