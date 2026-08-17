/**
 * App.tsx
 * =======
 * Main application shell for the Occlusion-Robust Road Extraction & Criticality Platform.
 */

import { useRef } from "react";
import { PipelineProvider } from "./state/PipelineContext";
import { Sidebar } from "./components/dashboard/Sidebar";
import { TopHeader, TopHeaderHandle } from "./components/dashboard/TopHeader";
import { KpiRow } from "./components/dashboard/KpiRow";
import { PipelineStages } from "./components/dashboard/PipelineStages";
import { ResilienceChart } from "./components/dashboard/ResilienceChart";
import { GatekeeperTable } from "./components/dashboard/GatekeeperTable";
import { WhatIfPanel } from "./components/dashboard/WhatIfPanel";
import { BottomSummaryBar } from "./components/dashboard/BottomSummaryBar";
import { useEffectOnMount } from "./lib/useEffectOnMount";
import { usePipeline } from "./state/PipelineContext";

function HealthPoller() {
  const { refreshHealth } = usePipeline();
  useEffectOnMount(() => {
    refreshHealth();
    const id = setInterval(refreshHealth, 15000);
    return () => clearInterval(id);
  });
  return null;
}

function DashboardShell() {
  const headerRef = useRef<TopHeaderHandle>(null);

  return (
    <div className="w-screen h-screen overflow-hidden flex bg-slate-100/80 font-sans antialiased text-slate-800">
      <HealthPoller />
      <Sidebar onUploadClick={() => headerRef.current?.openUploadDialog()} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col gap-4.5 p-6 max-w-[1560px] mx-auto min-h-full">
          {/* Header */}
          <TopHeader ref={headerRef} />

          {/* Key Metrics Row */}
          <KpiRow />

          {/* 5-Stage Visual Stepper */}
          <PipelineStages />

          {/* Bottom Analytics Grid (Resilience Curve + Gatekeepers + What-If Simulator) */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4.5 items-stretch">
            <ResilienceChart />
            <GatekeeperTable />
            <WhatIfPanel />
          </div>

          {/* Executive Summary & Export Strip */}
          <BottomSummaryBar />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <PipelineProvider>
      <DashboardShell />
    </PipelineProvider>
  );
}
