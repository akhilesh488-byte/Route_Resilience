/**
 * Sidebar.tsx
 * ===========
 * Dark left navigation rail. Visually matches the Figma export (bg
 * #0e1624, active-link bg #1a2536, blue accent #3b82f6) but is data-driven:
 * the "ACTIVE CURRENT RUN" box reflects the real job_id/checkpoint/timestamp
 * from PipelineContext instead of a hardcoded placeholder, and the sidebar
 * step highlighting tracks pipeline status.
 */

import { useRef, useState } from "react";
import {
  Globe, LayoutDashboard, Image as ImageIcon, Layers, Activity,
  CheckSquare, TrendingUp, UploadCloud, Sliders, History, Info, FileText,
} from "lucide-react";
import { usePipeline } from "../../state/PipelineContext";
import { ModelSettingsModal } from "./ModelSettingsModal";

const STAGE_ITEMS = [
  { icon: ImageIcon, label: "1. Input Image" },
  { icon: Layers, label: "2. Segmentation Mask" },
  { icon: Activity, label: "3. Graph Construction" },
  { icon: CheckSquare, label: "4. Healed Topology" },
  { icon: TrendingUp, label: "5. Criticality Metrics" },
];

function NavLink({ icon: Icon, label, active = false, indent = false, onClick }: {
  icon: React.ElementType; label: string; active?: boolean; indent?: boolean; onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex gap-3 items-center rounded-md w-full text-[13px] cursor-pointer ${
        indent ? "pl-6 pr-4 py-2" : "px-4 py-2"
      } ${active ? "bg-[#1a2536] text-white font-semibold" : "text-[#94a3b8] font-medium hover:bg-[#1a2536]/60"}`}
    >
      <Icon size={16} strokeWidth={2} className={active ? "text-[#3b82f6]" : "text-[#94a3b8]"} />
      <span className="flex-1">{label}</span>
    </div>
  );
}

export function Sidebar({ onUploadClick }: { onUploadClick: () => void }) {
  const { result, health, status } = usePipeline();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const activeIndex = result ? 4 : status === "running" ? Math.min(3, 0) : -1;

  return (
    <div className="bg-[#0e1624] flex flex-col gap-5 items-start px-4 py-6 self-stretch shrink-0 w-[260px]">
      {/* Brand */}
      <div className="flex flex-col gap-2 items-start w-full">
        <div className="flex gap-2.5 items-center">
          <div className="bg-[#3b82f6] flex items-start p-2 rounded-lg">
            <Globe size={18} strokeWidth={2} color="white" />
          </div>
          <p className="font-extrabold text-[16px] text-white">ORRE-GTC</p>
        </div>
        <p className="font-semibold text-[11px] text-[#3b82f6]">ROAD NETWORK PIPELINE</p>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-1 items-start w-full">
        <NavLink icon={LayoutDashboard} label="Dashboard" active />
        <p className="font-bold text-[10px] text-[#94a3b8] uppercase mt-2">Pipeline Stages</p>
        {STAGE_ITEMS.map((item, i) => (
          <NavLink key={item.label} icon={item.icon} label={item.label} indent active={i === activeIndex} />
        ))}
        <p className="font-bold text-[10px] text-[#94a3b8] uppercase mt-2">System Settings</p>
        <NavLink icon={UploadCloud} label="Upload Data" onClick={onUploadClick} />
        <NavLink icon={Sliders} label="Model & Parameters" onClick={() => setSettingsOpen(true)} />
        <NavLink icon={History} label="Past Runs" />
        <NavLink icon={Info} label="About Project" />
        <NavLink icon={FileText} label="Documentation" />
      </div>

      <div className="flex-1 min-h-px w-full" />

      {/* Current run status */}
      <div className="bg-[#1a2536] flex flex-col gap-2 items-start p-3.5 rounded-lg w-full">
        <div className="flex items-center justify-between w-full">
          <p className="font-semibold text-[11px] text-white">
            {status === "running" ? "RUN IN PROGRESS" : result ? "ACTIVE CURRENT RUN" : "NO RUN YET"}
          </p>
          <svg width="8" height="8">
            <circle cx="4" cy="4" r="4" fill={status === "running" ? "#F59E0B" : result ? "#10B981" : "#475569"} />
          </svg>
        </div>
        <div className="flex flex-col gap-1 items-start text-[10px] text-[#94a3b8] font-mono w-full">
          <p className="truncate w-full">ID: {result ? result.job_id.toUpperCase() : "—"}</p>
          <p className="truncate w-full">Checkpoint: {health?.checkpoint_name ?? "not loaded"}</p>
          <p className="truncate w-full">{result ? result.summary.created_at : "—"}</p>
        </div>
      </div>

      {settingsOpen && <ModelSettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
