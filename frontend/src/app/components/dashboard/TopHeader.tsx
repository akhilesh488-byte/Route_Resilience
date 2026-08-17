/**
 * TopHeader.tsx
 * =============
 * Page title + the "Upload New Data" button that drives the whole
 * dashboard: picking a file here calls POST /api/pipeline/run and every
 * other panel re-renders from the response via PipelineContext.
 *
 * Accepts either a satellite image (png/jpg -- runs real segmentation, so
 * a model checkpoint must be loaded first) or a precomputed binary mask
 * (skips segmentation, useful before your Colab training run finishes).
 */

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { UploadCloud, Loader2, Image as ImageIcon, Layers } from "lucide-react";
import { usePipeline } from "../../state/PipelineContext";

export interface TopHeaderHandle {
  openUploadDialog: () => void;
}

export const TopHeader = forwardRef<TopHeaderHandle>((_, ref) => {
  const { runPipeline, status, error, health } = usePipeline();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const maskInputRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const busy = status === "running";

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col gap-0.5">
        <p className="font-extrabold text-[22px] text-[#0f172a]">
          Occlusion-Robust Road Extraction &amp; Graph-Theoretic Criticality Pipeline
        </p>
        <p className="text-[13px] text-[#475569]">
          An AI-assisted civil infrastructure evaluation engine for remote sensing road segmentation and path resilience analysis.
        </p>
        {status === "error" && error && (
          <p className="text-[12px] text-[#ef4444] mt-1">⚠ {error}</p>
        )}
        {!health?.model_loaded && (
          <p className="text-[11px] text-[#f59e0b] mt-1">
            No model checkpoint loaded yet — upload a satellite image to run real segmentation once trained,
            or upload a precomputed mask to preview the graph pipeline now.
          </p>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          disabled={busy}
          className="bg-white flex gap-2 items-center px-4 py-2.5 rounded-lg border border-[#e2e8f0] shrink-0 disabled:opacity-60"
        >
          {busy ? <Loader2 size={16} className="animate-spin text-[#3b82f6]" /> : <UploadCloud size={16} className="text-[#3b82f6]" />}
          <span className="font-semibold text-[13px] text-[#0f172a]">
            {busy ? "Running pipeline..." : "Upload New Data"}
          </span>
        </button>

        {menuOpen && !busy && (
          <div className="absolute right-0 top-full mt-2 bg-white border border-[#e2e8f0] rounded-lg shadow-lg overflow-hidden z-20 w-[240px]">
            <button
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center gap-2 w-full px-4 py-3 text-left text-[13px] text-[#0f172a] hover:bg-[#f8fafc]"
            >
              <ImageIcon size={16} className="text-[#3b82f6]" />
              <span>Satellite image (run segmentation)</span>
            </button>
            <button
              onClick={() => maskInputRef.current?.click()}
              className="flex items-center gap-2 w-full px-4 py-3 text-left text-[13px] text-[#0f172a] hover:bg-[#f8fafc] border-t border-[#e2e8f0]"
            >
              <Layers size={16} className="text-[#8b5cf6]" />
              <span>Precomputed mask (skip segmentation)</span>
            </button>
          </div>
        )}

        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        <input ref={maskInputRef} type="file" accept="image/*" className="hidden" onChange={handleMaskChange} />
      </div>
    </div>
  );
});

TopHeader.displayName = "TopHeader";
