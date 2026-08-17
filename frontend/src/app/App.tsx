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
    <div className="w-screen h-screen overflow-hidden flex bg-[#f8fafc]">
      <HealthPoller />
      <Sidebar onUploadClick={() => headerRef.current?.openUploadDialog()} />

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-5 p-6 max-w-[1400px] mx-auto">
          <TopHeader ref={headerRef} />
          <KpiRow />
          <PipelineStages />
          <div className="flex gap-5 flex-wrap">
            <ResilienceChart />
            <GatekeeperTable />
            <WhatIfPanel />
          </div>
          <BottomSummaryBar />
        </div>
      </div>
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
