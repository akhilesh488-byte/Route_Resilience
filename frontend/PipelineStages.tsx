/**
 * PipelineStages.tsx
 * ===================
 * The 5-panel visual pipeline row: Input Satellite -> Segmentation Mask ->
 * Raw Topology Graph -> Healed Graph -> Gatekeeper Centrality. Each panel
 * shows a real artifact from the last run (image, mask, or GraphView) with
 * a chevron connector between stages, matching the original Figma layout.
 */

import { ChevronRight, ImageOff } from "lucide-react";
import { usePipeline } from "../../state/PipelineContext";
import { fileUrl } from "../../lib/api";
import { GraphView } from "./GraphView";

function StagePanel({ title, caption, children }: { title: string; caption: string; children: React.ReactNode }) {
  return (
    <div className="bg-white flex-1 flex flex-col rounded-xl border border-[#e2e8f0] overflow-hidden min-w-[180px]">
      <div className="aspect-square w-full bg-[#0f172a] relative overflow-hidden">{children}</div>
      <div className="flex flex-col gap-0.5 p-3">
        <p className="font-semibold text-[12px] text-[#0f172a]">{title}</p>
        <p className="text-[10px] text-[#94a3b8] font-mono">{caption}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#475569]">
      <ImageOff size={22} />
      <p className="text-[10px]">Awaiting run</p>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex items-center justify-center shrink-0 w-6">
      <ChevronRight size={18} className="text-[#cbd5e1]" />
    </div>
  );
}

export function PipelineStages() {
  const { result } = usePipeline();

  if (!result) {
    return (
      <div className="flex items-stretch w-full gap-0">
        {["Input Satellite", "Segmentation Mask", "Raw Topology Graph", "Healed Graph", "Gatekeeper Centrality"].map((title, i, arr) => (
          <div key={title} className="flex items-stretch flex-1">
            <StagePanel title={title} caption="—"><EmptyState /></StagePanel>
            {i < arr.length - 1 && <Connector />}
          </div>
        ))}
      </div>
    );
  }

  const { width, height } = result.summary.image;
  const inputUrl = fileUrl(result.files.input_image);
  const maskUrl = fileUrl(result.files.mask_image);
  const conf = result.summary.mean_segmentation_confidence;
  const topNodeIds = result.centrality.top_nodes.slice(0, 5).map((n) => n.node_id);

  const panels: { title: string; caption: string; body: React.ReactNode }[] = [
    {
      title: "Input Satellite",
      caption: `${width} × ${height} px`,
      body: <img src={inputUrl} alt="Input" className="w-full h-full object-cover" />,
    },
    {
      title: "Segmentation Mask",
      caption: conf !== null && conf !== undefined ? `Mean confidence: ${conf.toFixed(3)}` : "Precomputed mask",
      body: <img src={maskUrl} alt="Mask" className="w-full h-full object-cover" />,
    },
    {
      title: "Raw Topology Graph",
      caption: `${result.raw_graph.node_count} nodes · ${result.raw_graph.edge_count} edges`,
      body: (
        <GraphView
          graph={result.raw_graph}
          width={width}
          height={height}
          backgroundImageUrl={inputUrl}
          edgeColor="#94a3b8"
          nodeColor="#ef4444"
        />
      ),
    },
    {
      title: "Healed Graph",
      caption: `+${result.summary.healed_edges_added} healed link${result.summary.healed_edges_added === 1 ? "" : "s"} · ${result.summary.kpis.connectivity_ratio_pct.toFixed(1)}% gain`,
      body: (
        <GraphView
          graph={result.healed_graph}
          width={width}
          height={height}
          backgroundImageUrl={inputUrl}
          edgeColor="#10b981"
          healedEdgeColor="#22d3ee"
          nodeColor="#10b981"
        />
      ),
    },
    {
      title: "Gatekeeper Centrality",
      caption: `Top ${topNodeIds.length} of ${result.healed_graph.node_count} nodes`,
      body: (
        <GraphView
          graph={result.healed_graph}
          width={width}
          height={height}
          backgroundImageUrl={inputUrl}
          edgeColor="#334155"
          nodeColor="#334155"
          highlightNodeIds={topNodeIds}
          highlightColor="#f59e0b"
        />
      ),
    },
  ];

  return (
    <div className="flex items-stretch w-full gap-0">
      {panels.map((p, i) => (
        <div key={p.title} className="flex items-stretch flex-1">
          <StagePanel title={p.title} caption={p.caption}>{p.body}</StagePanel>
          {i < panels.length - 1 && <Connector />}
        </div>
      ))}
    </div>
  );
}
