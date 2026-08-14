/**
 * api.ts
 * ======
 * Thin typed client for the FastAPI backend (backend/app.py). Every shape
 * here mirrors what that backend actually returns -- see the docstrings in
 * backend/app.py if you need to cross-check a field.
 */

// Empty string = relative "/api/..." calls, which work automatically with
// the Vite dev proxy (see vite.config.ts) AND in production if you deploy
// the frontend behind a reverse proxy that forwards /api to the backend.
// Set VITE_API_URL explicitly (e.g. in a .env file) only if the backend
// lives on a different host/port with no proxy in front of it -- prefer
// an explicit IP like http://127.0.0.1:8000 over "localhost" there, since
// some environments resolve "localhost" to ::1 first and fail to connect
// even when the backend is listening on 127.0.0.1.
export const API_BASE = import.meta.env.VITE_API_URL ?? "";

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
  length: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  node_count: number;
  edge_count: number;
}

export interface KpiSummary {
  connectivity_ratio_pct: number;
  total_nodes: number;
  total_edges: number;
  global_efficiency: number;
  resilience_index: number;
  max_betweenness_centrality: number;
}

export interface PipelineSummary {
  job_id: string;
  created_at: string;
  image: { width: number; height: number };
  kpis: KpiSummary;
  raw_graph_counts: { nodes: number; edges: number };
  mean_segmentation_confidence: number | null;
  healed_edges_added: number;
}

export interface GatekeeperNode {
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

export interface PipelineRunResponse {
  job_id: string;
  summary: PipelineSummary;
  raw_graph: GraphData;
  healed_graph: GraphData;
  centrality: { top_nodes: GatekeeperNode[] };
  ablation: AblationData;
  files: { input_image: string; mask_image: string };
}

export interface WhatIfResponse {
  node_id: string;
  impact: {
    node_id: string | number;
    global_efficiency_before: number;
    global_efficiency_after: number;
    efficiency_drop_pct: number;
    gcc_fraction_before: number;
    gcc_fraction_after: number;
  };
  before_graph: GraphData;
  after_graph: GraphData;
}

export interface HealthResponse {
  status: string;
  device: string;
  model_loaded: boolean;
  checkpoint_name: string | null;
  backbone: string;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || JSON.stringify(body);
    } catch {
      /* ignore parse failure, fall back to statusText */
    }
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

export function fileUrl(path: string): string {
  // Backend returns paths like "/api/jobs/{id}/files/mask.png"
  return `${API_BASE}${path}`;
}

export const api = {
  health: (): Promise<HealthResponse> =>
    fetch(`${API_BASE}/api/health`).then((res) => handle<HealthResponse>(res)),

  loadModel: (checkpointFile: File, backbone: string): Promise<{ status: string; checkpoint_name: string; backbone: string }> => {
    const form = new FormData();
    form.append("checkpoint", checkpointFile);
    form.append("backbone", backbone);
    return fetch(`${API_BASE}/api/model/load`, { method: "POST", body: form }).then((res) => handle<{ status: string; checkpoint_name: string; backbone: string }>(res));
  },

  runPipeline: (opts: {
    image?: File;
    mask?: File;
    segThreshold?: number;
    maxGapDistance?: number;
    angleWeight?: number;
    ablationMode?: "dynamic" | "static";
    ablationStep?: number;
  }): Promise<PipelineRunResponse> => {
    const form = new FormData();
    if (opts.image) form.append("image", opts.image);
    if (opts.mask) form.append("mask", opts.mask);
    form.append("seg_threshold", String(opts.segThreshold ?? 0.5));
    form.append("max_gap_distance", String(opts.maxGapDistance ?? 60.0));
    form.append("angle_weight", String(opts.angleWeight ?? 40.0));
    form.append("ablation_mode", opts.ablationMode ?? "dynamic");
    form.append("ablation_step", String(opts.ablationStep ?? 0.02));
    return fetch(`${API_BASE}/api/pipeline/run`, { method: "POST", body: form }).then((res) => handle<PipelineRunResponse>(res));
  },

  whatIf: (jobId: string, nodeId: string): Promise<WhatIfResponse> => {
    const form = new FormData();
    form.append("node_id", nodeId);
    return fetch(`${API_BASE}/api/jobs/${jobId}/whatif`, { method: "POST", body: form }).then((res) => handle<WhatIfResponse>(res));
  },

  exportGexfUrl: (jobId: string): string => `${API_BASE}/api/jobs/${jobId}/export/gexf`,
  exportReportUrl: (jobId: string): string => `${API_BASE}/api/jobs/${jobId}/export/report`,
};
