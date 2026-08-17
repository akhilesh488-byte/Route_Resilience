/**
 * api.ts
 * ======
 * Typed client for the Route Resilience FastAPI backend (/api/*).
 */

export interface HealthResponse {
  status: string;
  device: string;
  model_loaded: boolean;
  checkpoint_name: string | null;
  backbone: string;
}

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  degree: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  healed: boolean;
  length?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  node_count: number;
  edge_count: number;
}

export interface TopNode {
  rank: number;
  node_id: string;
  score: number;
  degree: number;
}

export interface AblationData {
  removed_fractions: number[];
  gcc_fractions: number[];
  global_efficiencies: number[];
  resilience_index: number;
}

export interface PipelineSummary {
  job_id: string;
  created_at: string;
  image: {
    width: number;
    height: number;
  };
  kpis: {
    connectivity_ratio_pct: number;
    total_nodes: number;
    total_edges: number;
    global_efficiency: number;
    resilience_index: number;
    max_betweenness_centrality: number;
  };
  raw_graph_counts: {
    nodes: number;
    edges: number;
  };
  mean_segmentation_confidence?: number | null;
  healed_edges_added: number;
}

export interface PipelineRunResponse {
  job_id: string;
  summary: PipelineSummary;
  raw_graph: GraphData;
  healed_graph: GraphData;
  centrality: {
    top_nodes: TopNode[];
  };
  ablation: AblationData;
  files: {
    input_image: string;
    mask_image: string;
  };
}

export interface WhatIfImpact {
  node_id: string | number;
  global_efficiency_before: number;
  global_efficiency_after: number;
  efficiency_drop_pct: number;
  gcc_fraction_before: number;
  gcc_fraction_after: number;
}

export interface WhatIfResponse {
  node_id: string;
  impact: WhatIfImpact;
  before_graph: GraphData;
  after_graph: GraphData;
}

export interface RunPipelineOptions {
  image?: File;
  mask?: File;
  seg_threshold?: number;
  max_gap_distance?: number;
  angle_weight?: number;
  ablation_mode?: string;
  ablation_step?: number;
}

const API_BASE = import.meta.env.VITE_API_URL || "";

export function fileUrl(path?: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (API_BASE) {
    const cleanBase = API_BASE.replace(/\/+$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
  }
  return path;
}

export const api = {
  async health(): Promise<HealthResponse> {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) {
      throw new Error(`Health check failed: ${res.statusText}`);
    }
    return res.json();
  },

  async loadModel(
    checkpoint: File,
    backbone = "resnet50"
  ): Promise<{ status: string; checkpoint_name: string; backbone: string }> {
    const formData = new FormData();
    formData.append("checkpoint", checkpoint);
    formData.append("backbone", backbone);

    const res = await fetch(`${API_BASE}/api/model/load`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || "Failed to load model checkpoint");
    }

    return res.json();
  },

  async runPipeline(opts: RunPipelineOptions): Promise<PipelineRunResponse> {
    const formData = new FormData();
    if (opts.image) formData.append("image", opts.image);
    if (opts.mask) formData.append("mask", opts.mask);
    if (opts.seg_threshold !== undefined)
      formData.append("seg_threshold", String(opts.seg_threshold));
    if (opts.max_gap_distance !== undefined)
      formData.append("max_gap_distance", String(opts.max_gap_distance));
    if (opts.angle_weight !== undefined)
      formData.append("angle_weight", String(opts.angle_weight));
    if (opts.ablation_mode !== undefined)
      formData.append("ablation_mode", opts.ablation_mode);
    if (opts.ablation_step !== undefined)
      formData.append("ablation_step", String(opts.ablation_step));

    const res = await fetch(`${API_BASE}/api/pipeline/run`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || "Failed to run pipeline");
    }

    return res.json();
  },

  async whatIf(jobId: string, nodeId: string): Promise<WhatIfResponse> {
    const formData = new FormData();
    formData.append("node_id", nodeId);

    const res = await fetch(`${API_BASE}/api/jobs/${jobId}/whatif`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `Failed to run what-if for node ${nodeId}`);
    }

    return res.json();
  },

  exportGexfUrl(jobId: string): string {
    return `${API_BASE}/api/jobs/${jobId}/export/gexf`;
  },

  exportReportUrl(jobId: string): string {
    return `${API_BASE}/api/jobs/${jobId}/export/report`;
  },
};
