/**
 * PipelineStages.tsx
 * ===================
 * Five-panel visual pipeline progress stepper showing intermediate artifacts
 * at each stage of the AI & Graph-Theoretic pipeline.
 */

import { useState } from "react";
import {
  ChevronRight,
  Maximize2,
  X,
  Layers,
  Cpu,
  Activity,
  Network,
  TrendingUp,
  ImageOff,
  CheckCircle2,
} from "lucide-react";
import { usePipeline } from "../../state/PipelineContext";
import { fileUrl } from "../../lib/api";
import { GraphView } from "./GraphView";

interface StageCardProps {
  number: string;
  title: string;
  subtitle: string;
  metric?: string;
  icon: React.ElementType;
  isCompleted: boolean;
  children: React.ReactNode;
  onExpand?: () => void;
}

function StageCard({
  number,
  title,
  subtitle,
  metric,
  icon: Icon,
  isCompleted,
  children,
  onExpand,
}: StageCardProps) {
  return (
    <div className="bg-white flex-1 flex flex-col rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all min-w-[200px] group">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
            {number}
          </span>
          <span className="font-semibold text-[12px] text-slate-800 truncate">{title}</span>
        </div>
        {onExpand && (
          <button
            onClick={onExpand}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-200/60 transition-colors"
            title="Expand artifact"
          >
            <Maximize2 size={12} />
          </button>
        )}
      </div>

      {/* Main Viewport Container */}
      <div className="aspect-square w-full bg-slate-950 relative overflow-hidden flex items-center justify-center">
        {children}
      </div>

      {/* Bottom Metadata */}
      <div className="flex flex-col gap-1 p-3 bg-white border-t border-slate-100">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] text-slate-500 font-medium truncate">{subtitle}</span>
          {isCompleted && (
            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
          )}
        </div>
        {metric && (
          <p className="text-[11px] font-mono font-semibold text-emerald-700 truncate bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
            {metric}
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyStatePlaceholder({ label }: { label: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-600 p-4 select-none">
      <ImageOff size={20} className="text-slate-700" />
      <span className="text-[11px] font-medium text-slate-400 text-center">{label}</span>
    </div>
  );
}

function StageConnector() {
  return (
    <div className="hidden 2xl:flex items-center justify-center shrink-0 px-1">
      <ChevronRight size={18} className="text-slate-300" />
    </div>
  );
}

export function PipelineStages() {
  const { result } = usePipeline();
  const [modalStage, setModalStage] = useState<{ title: string; content: React.ReactNode } | null>(
    null
  );

  const STAGES_META = [
    { num: "01", title: "Source Satellite", subtitle: "High-Res Optical Tile", icon: Layers },
    { num: "02", title: "DeepLabV3+ Mask", subtitle: "Soft-Skeleton Segmentation", icon: Cpu },
    { num: "03", title: "Raw Topology", subtitle: "Skeleton → Laplacian Graph", icon: Activity },
    { num: "04", title: "Healed Topology", subtitle: "MST Angular Bridging", icon: Network },
    { num: "05", title: "Critical Gatekeepers", subtitle: "Betweenness Bottlenecks", icon: TrendingUp },
  ];

  if (!result) {
    return (
      <div className="flex flex-col lg:flex-row items-stretch w-full gap-3">
        {STAGES_META.map((meta, i) => (
          <div key={meta.title} className="flex items-stretch flex-1">
            <StageCard
              number={meta.num}
              title={meta.title}
              subtitle={meta.subtitle}
              icon={meta.icon}
              isCompleted={false}
            >
              <EmptyStatePlaceholder label="Awaiting run" />
            </StageCard>
            {i < STAGES_META.length - 1 && <StageConnector />}
          </div>
        ))}
      </div>
    );
  }

  const { width, height } = result.summary.image;
  const inputUrl = fileUrl(result.files.input_image);
  const maskUrl = fileUrl(result.files.mask_image);
  const topNodeIds = result.centrality.top_nodes.slice(0, 3).map((n) => n.node_id);

  const stageContents = [
    // 1. Input Image
    {
      ...STAGES_META[0],
      metric: `${width}×${height} px tile`,
      content: (
        <img
          src={inputUrl}
          alt="Satellite Tile"
          className="w-full h-full object-cover select-none"
        />
      ),
    },
    // 2. Binary / Prob Mask
    {
      ...STAGES_META[1],
      metric: "Binary Road Mask",
      content: (
        <img
          src={maskUrl}
          alt="Segmentation Mask"
          className="w-full h-full object-cover select-none"
        />
      ),
    },
    // 3. Raw Graph
    {
      ...STAGES_META[2],
      metric: `${result.raw_graph.node_count} nodes, ${result.raw_graph.edge_count} edges`,
      content: (
        <GraphView
          graph={result.raw_graph}
          width={width}
          height={height}
          backgroundImageUrl={inputUrl}
          edgeColor="#94a3b8"
          nodeColor="#38bdf8"
        />
      ),
    },
    // 4. Healed Graph
    {
      ...STAGES_META[3],
      metric: `+${result.summary.healed_edges_added} bridged links`,
      content: (
        <GraphView
          graph={result.healed_graph}
          width={width}
          height={height}
          backgroundImageUrl={inputUrl}
          edgeColor="#94a3b8"
          healedEdgeColor="#10b981"
          nodeColor="#38bdf8"
        />
      ),
    },
    // 5. Critical Gatekeeper Centrality
    {
      ...STAGES_META[4],
      metric: `Top: Node ${topNodeIds[0] ?? "—"}`,
      content: (
        <GraphView
          graph={result.healed_graph}
          width={width}
          height={height}
          backgroundImageUrl={inputUrl}
          edgeColor="#64748b"
          healedEdgeColor="#10b981"
          nodeColor="#38bdf8"
          highlightNodeIds={topNodeIds}
          highlightColor="#f59e0b"
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col lg:flex-row items-stretch w-full gap-3">
        {stageContents.map((stage, i) => (
          <div key={stage.title} className="flex items-stretch flex-1">
            <StageCard
              number={stage.num}
              title={stage.title}
              subtitle={stage.subtitle}
              metric={stage.metric}
              icon={stage.icon}
              isCompleted={true}
              onExpand={() =>
                setModalStage({ title: `${stage.num}. ${stage.title}`, content: stage.content })
              }
            >
              {stage.content}
            </StageCard>
            {i < stageContents.length - 1 && <StageConnector />}
          </div>
        ))}
      </div>

      {/* Full-Screen Zoom Modal */}
      {modalStage && (
        <div
          className="fixed inset-0 bg-slate-900/75 backdrop-blur-md flex items-center justify-center z-50 p-6"
          onClick={() => setModalStage(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-[800px] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-[16px] text-slate-900">{modalStage.title}</h3>
              <button
                onClick={() => setModalStage(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200/60 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="aspect-square w-full bg-slate-950 flex items-center justify-center relative">
              {modalStage.content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
