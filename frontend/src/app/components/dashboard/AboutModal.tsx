/**
 * AboutModal.tsx
 * ==============
 * Informational dialog explaining project background, ISRO/NNRMS alignment,
 * methodology, and team objectives.
 */

import { X, Globe2, Cpu, Network, ShieldCheck, MapPin } from "lucide-react";

export function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-[620px] max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-700 text-white shadow-sm shadow-emerald-700/20">
              <Globe2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-[17px] text-slate-900">About ORRE-GTC</h3>
              <p className="text-[12px] text-slate-500 font-medium">
                Civil Infrastructure & Remote Sensing Intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5 text-[13px] text-slate-600 leading-relaxed">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              <MapPin size={11} /> ISRO / NNRMS Problem Statement Alignment
            </span>
            <p>
              High-resolution satellite imagery often suffers from road occlusion caused by heavy tree canopy, cloud cover, building shadows, and terrain relief. This project provides an <strong>end-to-end AI + Graph-Theoretic framework</strong> to extract topologically continuous road networks, heal broken connections, identify structural bottlenecks, and simulate disaster resilience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-[13px]">
                <Cpu size={16} className="text-emerald-600" />
                Phase I: Segmentation
              </div>
              <p className="text-[12px] text-slate-500">
                DeepLabV3+ with ResNet backbone and Soft-Skeleton / clDice loss for centerline continuity under canopy occlusion.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-[13px]">
                <Network size={16} className="text-emerald-600" />
                Phase II: Graph Healing
              </div>
              <p className="text-[12px] text-slate-500">
                Skimage skeletonization to NetworkX graph, healed via Kruskal-style MST &amp; Disjoint-Set algorithm with angular tangent penalty.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-[13px]">
                <ShieldCheck size={16} className="text-amber-600" />
                Phase III: Centrality
              </div>
              <p className="text-[12px] text-slate-500">
                Exact and pivot-approximated Betweenness Centrality ranking to discover critical gatekeeper bridges and choke-points.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-[13px]">
                <Globe2 size={16} className="text-red-600" />
                Phase IV: Resilience Stress Test
              </div>
              <p className="text-[12px] text-slate-500">
                Global Network Efficiency (E(G)) computation and sequential node ablation to compute the Resilience Index (AUC).
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-800 text-[12px]">
            <strong>Disaster Response &amp; Planning:</strong> This dashboard enables civil defense teams to instantly test "What-If" scenarios to evaluate how the loss of a specific bridge or highway junction impacts overall city mobility.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-[12px] font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
