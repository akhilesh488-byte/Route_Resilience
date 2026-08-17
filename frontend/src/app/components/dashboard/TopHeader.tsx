/**
 * TopHeader.tsx
 * =============
 * Professional top bar featuring project branding, dataset upload dropdown,
 * and 1-click instant demo launcher.
 */

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import {
  UploadCloud,
  Loader2,
  Image as ImageIcon,
  Layers,
  Sparkles,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import { usePipeline } from "../../state/PipelineContext";
import { generateSampleRoadMask } from "../../lib/sampleData";

export interface TopHeaderHandle {
  openUploadDialog: () => void;
}

export const TopHeader = forwardRef<TopHeaderHandle>((_, ref) => {
  const { runPipeline, status, error, health } = usePipeline();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const maskInputRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    openUploadDialog: () => imageInputRef.current?.click(),
  }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setMenuOpen(false);
    if (file) runPipeline({ image: file });
    e.target.value = "";
  };

  const handleMaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setMenuOpen(false);
    if (file) runPipeline({ mask: file });
    e.target.value = "";
  };

  const handleRunDemo = async () => {
    setDemoLoading(true);
    try {
      const sampleMask = await generateSampleRoadMask();
      await runPipeline({ mask: sampleMask });
    } catch (err) {
      console.error("Failed to run sample demo", err);
    } finally {
      setDemoLoading(false);
    }
  };

  const busy = status === "running" || demoLoading;

  return (
    <header className="flex flex-col gap-3.5 w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Metadata */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-extrabold text-[20px] text-slate-900 tracking-tight">
              Occlusion-Robust Road Extraction &amp; Criticality Platform
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={12} /> ISRO / NNRMS Aligned
            </span>
          </div>

          <p className="text-[13px] text-slate-500 font-normal">
            AI-driven remote sensing road segmentation, topological MST healing, and graph-theoretic disaster resilience evaluation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Demo Button */}
          <button
            onClick={handleRunDemo}
            disabled={busy}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12.5px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 transition-all shadow-xs"
            title="Generate a synthetic occluded road network and run the entire pipeline instantly"
          >
            {busy ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Sparkles size={15} className="text-emerald-100" />
            )}
            <span>{busy ? "Executing Pipeline..." : "Run Demo Sample"}</span>
          </button>

          {/* Upload Data Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              disabled={busy}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12.5px] font-semibold bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 disabled:opacity-60 transition-all shadow-xs"
            >
              <UploadCloud size={15} />
              <span>Upload Custom Data</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {menuOpen && !busy && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-30 w-[270px] py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-start gap-2.5 w-full px-3.5 py-2.5 text-left text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <ImageIcon size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[12.5px] font-semibold">Satellite Tile (.png / .jpg)</p>
                    <p className="text-[11px] text-slate-500">Runs full DeepLabV3+ neural segmentation</p>
                  </div>
                </button>

                <div className="h-px bg-slate-100 my-1" />

                <button
                  onClick={() => maskInputRef.current?.click()}
                  className="flex items-start gap-2.5 w-full px-3.5 py-2.5 text-left text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <Layers size={16} className="text-teal-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[12.5px] font-semibold">Binary Road Mask (.png)</p>
                    <p className="text-[11px] text-slate-500">Skips DL inference, runs graph healing directly</p>
                  </div>
                </button>
              </div>
            )}

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <input
              ref={maskInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleMaskChange}
            />
          </div>
        </div>
      </div>

      {/* Dynamic Alerts */}
      {status === "error" && error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[12px] font-medium">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </header>
  );
});

TopHeader.displayName = "TopHeader";
