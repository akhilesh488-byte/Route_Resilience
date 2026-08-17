/**
 * ResilienceChart.tsx
 * ====================
 * Real chart (recharts) of the node-ablation stress test: Giant Connected
 * Component fraction and Global Efficiency vs. fraction of nodes removed,
 * plus the single Resilience Index score. Replaces the original mock's
 * hand-placed rotated <div> line segments with actual data-bound plotting.
 */

import {
  ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from "recharts";
import { ShieldAlert } from "lucide-react";
import { usePipeline } from "../../state/PipelineContext";

export function ResilienceChart() {
  const { result } = usePipeline();
  const ablation = result?.ablation;

  const data = ablation
    ? ablation.removed_fractions.map((f, i) => ({
        removed: Math.round(f * 1000) / 10, // percent, 1 decimal
        gcc: ablation.gcc_fractions[i],
        efficiency: ablation.global_efficiencies[i],
      }))
    : [];

  return (
    <div className="bg-white flex flex-col gap-4 p-5 rounded-xl border border-[#e2e8f0] flex-1 min-w-[380px]">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-[14px] text-[#0f172a]">Global Network Resilience</p>
          <p className="text-[11px] text-[#94a3b8]">Dynamic betweenness-targeted node ablation</p>
        </div>
        <div className="bg-[#f0fdfa] border border-[#0d9488]/20 rounded-lg px-3 py-2 flex items-center gap-2">
          <ShieldAlert size={16} className="text-[#0d9488]" />
          <div>
            <p className="font-mono font-bold text-[16px] text-[#0d9488] leading-none">
              {ablation ? ablation.resilience_index.toFixed(3) : "—"}
            </p>
            <p className="text-[9px] text-[#0d9488]/70 uppercase">Resilience Index</p>
          </div>
        </div>
      </div>

      <div className="h-[220px] w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gccFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="removed"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                unit="%"
                label={{ value: "Nodes Removed", position: "insideBottom", offset: -2, fontSize: 10, fill: "#94a3b8" }}
              />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} domain={[0, 1]} />
              <Tooltip
                formatter={(value: number, name: string) => [value.toFixed(3), name]}
                labelFormatter={(l) => `${l}% removed`}
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="gcc" name="GCC Fraction" stroke="#3b82f6" fill="url(#gccFill)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="efficiency" name="Global Efficiency" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="4 3" />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[12px] text-[#94a3b8]">
            Run the pipeline to simulate infrastructure failure
          </div>
        )}
      </div>
    </div>
  );
}
