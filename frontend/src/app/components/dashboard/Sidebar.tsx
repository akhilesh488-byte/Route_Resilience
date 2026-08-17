/**
 * Sidebar.tsx
 * ===========
 * Professional enterprise navigation sidebar for the Road Resilience & Criticality Platform.
 */

import { useState } from "react";
import {
  Layers,
  Activity,
  CheckCircle2,
  TrendingUp,
  UploadCloud,
  Sliders,
  Info,
  FileText,
  Network,
  LayoutDashboard,
  Cpu,
  MapPin,
  Sparkles,
} from "lucide-react";
import { usePipeline } from "../../state/PipelineContext";
import { ModelSettingsModal } from "./ModelSettingsModal";
import { AboutModal } from "./AboutModal";
import { DocsModal } from "./DocsModal";

const STAGE_ITEMS = [
  { icon: Layers, label: "1. Input Satellite", phase: "Phase I" },
  { icon: Cpu, label: "2. Segmentation Mask", phase: "Phase I" },
  { icon: Activity, label: "3. Raw Road Topology", phase: "Phase II" },
  { icon: Network, label: "4. Healed Graph", phase: "Phase II" },
  { icon: TrendingUp, label: "5. Criticality Intelligence", phase: "Phase III" },
];

export function Sidebar({ onUploadClick }: { onUploadClick: () => void }) {
  const { result, health, status } = usePipeline();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);

  const activeIndex = result ? 4 : status === "running" ? 1 : -1;

  return (
    <aside className="bg-white border-r border-slate-200 flex flex-col justify-between px-4 py-5 self-stretch shrink-0 w-[270px] select-none">
      <div className="flex flex-col gap-6 w-full">
        {/* Brand & Emblem */}
        <div className="flex items-center gap-3 px-2">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-2.5 rounded-xl shadow-sm text-white flex items-center justify-center">
            <Network size={20} strokeWidth={2.2} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[17px] text-slate-900 tracking-tight">
                ORRE-GTC
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                PRO
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">
              Civil Road Resilience
            </p>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex flex-col gap-5 w-full">
          {/* Main Dashboard */}
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200/60 shadow-xs transition-all w-full text-left">
              <LayoutDashboard size={17} className="text-emerald-700" />
              <span>Executive Dashboard</span>
            </button>
          </div>

          {/* Pipeline Phases */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between px-3 text-[10.5px] font-bold tracking-wider text-slate-400 uppercase">
              <span>Pipeline Stages</span>
              {result && (
                <span className="text-emerald-600 font-mono text-[10px]">5/5 DONE</span>
              )}
            </div>

            <div className="flex flex-col gap-0.5 mt-1">
              {STAGE_ITEMS.map((item, i) => {
                const Icon = item.icon;
                const isPassed = result !== null;
                const isCurrent = i === activeIndex;

                return (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-[12.5px] transition-colors ${
                      isCurrent
                        ? "bg-slate-100/90 text-slate-900 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        size={15}
                        className={
                          isCurrent
                            ? "text-emerald-600"
                            : isPassed
                            ? "text-emerald-600/70"
                            : "text-slate-400"
                        }
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {isPassed ? (
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {item.phase}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* System & Tools */}
          <div className="flex flex-col gap-1">
            <div className="px-3 text-[10.5px] font-bold tracking-wider text-slate-400 uppercase">
              System Controls
            </div>

            <div className="flex flex-col gap-0.5 mt-1">
              <button
                onClick={onUploadClick}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors w-full text-left"
              >
                <UploadCloud size={15} className="text-slate-500" />
                <span>Upload Dataset</span>
              </button>

              <button
                onClick={() => setSettingsOpen(true)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors w-full text-left"
              >
                <Sliders size={15} className="text-slate-500" />
                <span>Model &amp; Checkpoints</span>
              </button>

              <button
                onClick={() => setAboutOpen(true)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors w-full text-left"
              >
                <Info size={15} className="text-slate-500" />
                <span>About Methodology</span>
              </button>

              <button
                onClick={() => setDocsOpen(true)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors w-full text-left"
              >
                <FileText size={15} className="text-slate-500" />
                <span>Technical Formulations</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Engine Status Card */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col gap-2.5 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                status === "running"
                  ? "bg-amber-500 animate-pulse"
                  : result
                  ? "bg-emerald-500"
                  : "bg-slate-400"
              }`}
            />
            <span className="font-bold text-[11px] text-slate-800 uppercase tracking-wider">
              {status === "running"
                ? "Processing Run"
                : result
                ? "Pipeline Active"
                : "Engine Ready"}
            </span>
          </div>

          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-600 uppercase font-semibold">
            {health?.device ?? "CPU"}
          </span>
        </div>

        <div className="flex flex-col gap-1 text-[11px] text-slate-500 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[10px]">JOB ID:</span>
            <span className="font-semibold text-slate-700 truncate max-w-[120px]">
              {result ? result.job_id.toUpperCase() : "None"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[10px]">MODEL:</span>
            <span className="font-semibold text-slate-700 truncate max-w-[120px]">
              {health?.model_loaded ? health.backbone : "Untrained Head"}
            </span>
          </div>
        </div>
      </div>

      {/* Modals */}
      {settingsOpen && <ModelSettingsModal onClose={() => setSettingsOpen(false)} />}
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
      {docsOpen && <DocsModal onClose={() => setDocsOpen(false)} />}
    </aside>
  );
}
