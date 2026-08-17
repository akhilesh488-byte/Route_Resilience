/**
 * DocsModal.tsx
 * =============
 * Mathematical reference and API documentation modal for engineers and evaluators.
 */

import { X, BookOpen, Code2, Calculator, CheckCircle2 } from "lucide-react";

export function DocsModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-[680px] max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 text-white shadow-sm">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="font-bold text-[17px] text-slate-900">Technical Documentation &amp; Formulations</h3>
              <p className="text-[12px] text-slate-500 font-medium">Pipeline Algorithms &amp; Metric Definitions</p>
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
        <div className="p-6 flex flex-col gap-5 text-[13px] text-slate-600 leading-relaxed font-sans">
          {/* Section 1: Topological Healing */}
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-[14px] text-slate-900 flex items-center gap-2">
              <Calculator size={16} className="text-emerald-600" />
              1. Angular-Weighted MST Healing Formula
            </h4>
            <p className="text-slate-600 text-[12px]">
              To prevent ghost connections between parallel streets, candidate candidate bridging edges between degree-1 endpoint nodes $u$ and $v$ are penalized by their tangent angle deviation $\theta$:
            </p>
            <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-[12px] rounded-lg border border-slate-800">
              Cost(u, v) = Distance(u, v) + λ_angle × [1 - cos(θ_u - θ_v)]
            </div>
            <p className="text-[11px] text-slate-500">
              Only candidate edges with Distance &lt; 60px and within disjoint graph components are bridged into a spanning forest.
            </p>
          </div>

          {/* Section 2: Global Efficiency */}
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-[14px] text-slate-900 flex items-center gap-2">
              <Calculator size={16} className="text-emerald-600" />
              2. Global Network Efficiency E(G)
            </h4>
            <p className="text-slate-600 text-[12px]">
              Measures how efficiently information/traffic flows over the network across all node pairs:
            </p>
            <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-[12px] rounded-lg border border-slate-800">
              E(G) = [1 / (N × (N - 1))] × ∑_(i ≠ j) [1 / d(i, j)]
            </div>
            <p className="text-[11px] text-slate-500">
              Where $d(i, j)$ is the shortest path distance. If nodes $i$ and $j$ are disconnected, $1 / d(i, j) = 0$.
            </p>
          </div>

          {/* Section 3: Resilience Index (AUC) */}
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-[14px] text-slate-900 flex items-center gap-2">
              <Calculator size={16} className="text-emerald-600" />
              3. Resilience Index (AUC of GCC Curve)
            </h4>
            <p className="text-slate-600 text-[12px]">
              The Resilience Index is computed by progressively removing nodes in order of highest Betweenness Centrality and integrating the area under the Giant Connected Component (GCC) curve:
            </p>
            <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-[12px] rounded-lg border border-slate-800">
              R = ∫_0^1 S(q) dq  (Trapezoidal Numerical Integration)
            </div>
            <p className="text-[11px] text-slate-500">
              $S(q)$ is the remaining fraction of nodes in the largest connected cluster after removing fraction $q$ of critical nodes. Higher $R$ indicates superior structural fault tolerance.
            </p>
          </div>

          {/* Section 4: Export Formats */}
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-[14px] text-slate-900 flex items-center gap-2">
              <Code2 size={16} className="text-slate-700" />
              4. Supported Output &amp; GIS Interoperability
            </h4>
            <ul className="list-disc pl-5 text-[12px] text-slate-600 space-y-1">
              <li><strong>GEXF (Graph Exchange XML Format):</strong> Native import support for QGIS, ArcGIS, and Gephi with pixel coordinate positions.</li>
              <li><strong>JSON Infrastructure Summary:</strong> Formatted civil analytics report with gatekeeper rankings and damage curves.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-[12px] font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
