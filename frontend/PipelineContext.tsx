/**
 * PipelineContext.tsx
 * ====================
 * Single source of truth for everything the dashboard renders: the current
 * job's graphs, KPIs, centrality table, resilience curve, model status, and
 * loading/error state. Every dashboard component reads from here via
 * `usePipeline()` instead of holding its own local copies of server data.
 */

import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import {
  api,
  HealthResponse,
  PipelineRunResponse,
  WhatIfResponse,
} from "../lib/api";

export type StageStatus = "idle" | "running" | "done" | "error";

interface PipelineContextValue {
  // Server / model state
  health: HealthResponse | null;
  refreshHealth: () => Promise<void>;
  loadModel: (file: File, backbone: string) => Promise<void>;
  modelLoading: boolean;
  modelError: string | null;

  // Current run
  result: PipelineRunResponse | null;
  status: StageStatus;
  error: string | null;
  runPipeline: (opts: { image?: File; mask?: File }) => Promise<void>;

  // What-if simulation
  whatIf: WhatIfResponse | null;
  whatIfLoading: boolean;
  whatIfError: string | null;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  runWhatIf: (nodeId: string) => Promise<void>;
}

const PipelineContext = createContext<PipelineContextValue | null>(null);

export function PipelineProvider({ children }: { children: ReactNode }) {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  const [result, setResult] = useState<PipelineRunResponse | null>(null);
  const [status, setStatus] = useState<StageStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const [whatIf, setWhatIf] = useState<WhatIfResponse | null>(null);
  const [whatIfLoading, setWhatIfLoading] = useState(false);
  const [whatIfError, setWhatIfError] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const refreshHealth = useCallback(async () => {
    try {
      const h = await api.health();
      setHealth(h);
    } catch {
      setHealth(null);
    }
  }, []);

  const loadModel = useCallback(async (file: File, backbone: string) => {
    setModelLoading(true);
    setModelError(null);
    try {
      await api.loadModel(file, backbone);
      await refreshHealth();
    } catch (e) {
      setModelError(e instanceof Error ? e.message : String(e));
      throw e;
    } finally {
      setModelLoading(false);
    }
  }, [refreshHealth]);

  const runPipeline = useCallback(async (opts: { image?: File; mask?: File }) => {
    setStatus("running");
    setError(null);
    setWhatIf(null);
    setSelectedNodeId(null);
    try {
      const res = await api.runPipeline(opts);
      setResult(res);
      setStatus("done");
      // Default the what-if selector to the top gatekeeper node.
      if (res.centrality.top_nodes.length > 0) {
        setSelectedNodeId(res.centrality.top_nodes[0].node_id);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }, []);

  const runWhatIf = useCallback(async (nodeId: string) => {
    if (!result) return;
    setWhatIfLoading(true);
    setWhatIfError(null);
    try {
      const res = await api.whatIf(result.job_id, nodeId);
      setWhatIf(res);
    } catch (e) {
      setWhatIfError(e instanceof Error ? e.message : String(e));
    } finally {
      setWhatIfLoading(false);
    }
  }, [result]);

  const value: PipelineContextValue = {
    health,
    refreshHealth,
    loadModel,
    modelLoading,
    modelError,
    result,
    status,
    error,
    runPipeline,
    whatIf,
    whatIfLoading,
    whatIfError,
    selectedNodeId,
    setSelectedNodeId,
    runWhatIf,
  };

  return <PipelineContext.Provider value={value}>{children}</PipelineContext.Provider>;
}

export function usePipeline(): PipelineContextValue {
  const ctx = useContext(PipelineContext);
  if (!ctx) throw new Error("usePipeline must be used within a PipelineProvider");
  return ctx;
}
