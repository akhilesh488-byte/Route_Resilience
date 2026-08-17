/**
 * PipelineStages.tsx
 * ===================
 * Interactive 5-stage sequential algorithmic flow stepper.
 * Displays each phase of the remote sensing and graph resilience pipeline
 * connected with prominent flow-direction badges, process transformation tags,
 * and high-resolution visual artifact containers.
 */

import { useState } from "react";
import {
  ArrowRight,
  ArrowDown,
  Maximize2,
  X,
  Layers,
  Cpu,
  Activity,
  Network,
  TrendingUp,
  ImageOff,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { usePipeline } from "../../state/PipelineContext";
import { fileUrl } from "../../lib/api";
import { GraphView } from "./GraphView";

interface StageCardProps {
  number: string;
  stepName: string;
  title: string;
  subtitle: string;
  metric?: string;
  accentColor: string;
  isCompleted: boolean;
  children: React.ReactNode;
  onExpand?: () => void;
}

function StageCard({
  number,
  stepName,
  title,
  subtitle,
  metric,
  accentColor,
  isCompleted,
  children,
  onExpand,
}: StageCardProps) {
  return (
    <div className="bg-white flex-1 flex flex-col rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all min-w-[190px] relative group">
      {/* Top Accent Strip */}
      <div className={`h-1 w-full ${accentColor}`} />

      {/* Top Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/70 border-b border-slate-100">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-mono text-[9.5px] font-extrabold px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 tracking-tight shrink-0">
            {stepName}
          </span>
          <span className="font-bold text-[12px] text-slate-800 truncate" title={title}>
            {title}
          </span>
        </div>
        {onExpand && (
          <button
            onClick={onExpand}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200/60 transition-colors shrink-0"
            title="Expand artifact in full view"
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

interface ConnectorProps {
  label: string;
  isCompleted: boolean;
  isActive: boolean;
}

function FlowConnector({ label, isCompleted, isActive }: ConnectorProps) {
  return (
    <div className="flex md:flex-col lg:flex-row items-center justify-center shrink-0 self-center px-1 py-1 z-10">
      {/* Desktop / Tablet Horizontal Connector */}
      <div className="hidden lg:flex items-center">
        {/* Left Track Line */}
        <div
          className={`w-2.5 xl:w-4 h-0.5 transition-colors ${
            isCompleted ? "bg-emerald-400" : isActive ? "bg-emerald-300" : "bg-slate-200"
          }`}
        />

        {/* Directional Circle Badge */}
        <div
          className={`flex flex-col items-center justify-center group relative transition-all ${
            isCompleted
              ? "w-8 h-8 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-700 shadow-sm shadow-emerald-500/15"
              : isActive
              ? "w-8 h-8 rounded-full bg-white border-2 border-emerald-500 text-emerald-600 shadow-sm animate-pulse"
              : "w-7 h-7 rounded-full bg-slate-50 border border-slate-300 text-slate-400"
          }`}
        >
          <ArrowRight
            size={isCompleted ? 14 : 12}
            strokeWidth={2.5}
            className={isCompleted ? "text-emerald-700" : isActive ? "text-emerald-600" : "text-slate-400"}
          />

          {/* Process step micro-tag tooltip/label */}
          <span className="absolute -bottom-4.5 whitespace-nowrap text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
            {label}
          </span>
        </div>

        {/* Right Track Line */}
        <div
          className={`w-2.5 xl:w-4 h-0.5 transition-colors ${
            isCompleted ? "bg-emerald-400" : "bg-slate-200"
          }`}
        />
      </div>

      {/* Mobile Vertical Connector */}
      <div className="flex lg:hidden flex-col items-center py-2">
        <div
          className={`w-0.5 h-3 ${
            isCompleted ? "bg-emerald-400" : "bg-slate-200"
          }`}
        />
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center border ${
            isCompleted
              ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs"
              : "bg-slate-50 border-slate-300 text-slate-400"
          }`}
        >
          <ArrowDown size={13} strokeWidth={2.5} />
        </div>
        <div
          className={`w-0.5 h-3 ${
            isCompleted ? "bg-emerald-400" : "bg-slate-200"
          }`}
        />
      </div>
    </div>
  );
}

export function PipelineStages() {
  const { result, status } = usePipeline();
  const [modalStage, setModalStage] = useState<{ title: string; content: React.ReactNode } | null>(
    null
  );

  const isRunning = status === "running";
  const isDone = result !== null;

  const STAGES_META = [
    {
      num: "01",
      stepName: "STAGE 01",
      title: "Satellite Tile",
      subtitle: "High-Res Optical Source",
      accentColor: "bg-slate-700",
      connectorLabel: "Segment",
    },
    {
      num: "02",
      stepName: "STAGE 02",
      title: "DeepLabV3+ Mask",
      subtitle: "Soft-Skeleton Loss",
      accentColor: "bg-teal-600",
      connectorLabel: "Vectorize",
    },
    {
      num: "03",
      stepName: "STAGE 03",
      title: "Raw Road Graph",
      subtitle: "Laplacian Junctions",
      accentColor: "bg-sky-600",
      connectorLabel: "MST Heal",
    },
    {
      num: "04",
      stepName: "STAGE 04",
      title: "Healed Topology",
      subtitle: "Angular Bridging",
      accentColor: "bg-emerald-600",
      connectorLabel: "Centrality",
    },
    {
      num: "05",
      stepName: "STAGE 05",
      title: "Critical Gatekeepers",
      subtitle: "Betweenness Bottlenecks",
      accentColor: "bg-amber-500",
      connectorLabel: "Done",
    },
  ];

  if (!result) {
    return (
      <div className="flex flex-col lg:flex-row items-stretch w-full gap-2 lg:gap-0 pb-3">
        {STAGES_META.map((meta, i) => (
          <div key={meta.title} className="flex flex-col lg:flex-row items-stretch flex-1">
            <StageCard
              number={meta.num}
              stepName={meta.stepName}
              title={meta.title}
              subtitle={meta.subtitle}
              accentColor={meta.accentColor}
              isCompleted={false}
            >
              <EmptyStatePlaceholder label="Awaiting pipeline run" />
            </StageCard>

            {i < STAGES_META.length - 1 && (
              <FlowConnector
                label={meta.connectorLabel}
                isCompleted={false}
                isActive={isRunning && i === 0}
              />
            )}
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
      metric: `Top: Junction #${topNodeIds[0] ?? "—"}`,
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
      <div className="flex flex-col lg:flex-row items-stretch w-full gap-2 lg:gap-0 pb-3">
        {stageContents.map((stage, i) => (
          <div key={stage.title} className="flex flex-col lg:flex-row items-stretch flex-1">
            <StageCard
              number={stage.num}
              stepName={stage.stepName}
              title={stage.title}
              subtitle={stage.subtitle}
              metric={stage.metric}
              accentColor={stage.accentColor}
              isCompleted={true}
              onExpand={() =>
                setModalStage({ title: `${stage.stepName}: ${stage.title}`, content: stage.content })
              }
            >
              {stage.content}
            </StageCard>

            {i < stageContents.length - 1 && (
              <FlowConnector
                label={stage.connectorLabel}
                isCompleted={isDone}
                isActive={false}
              />
            )}
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
