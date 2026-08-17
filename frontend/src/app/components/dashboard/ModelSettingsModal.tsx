/**
 * ModelSettingsModal.tsx
 * =======================
 * "Model & Parameters" panel: upload the .pt checkpoint saved by train.py
 * on Colab (best.pt or last.pt), pick the backbone it was trained with, and
 * confirm the load. This is the bridge between "I trained the model" and
 * "the dashboard can now run real segmentation".
 */

import { useRef, useState } from "react";
import { X, UploadCloud, CheckCircle2, Loader2 } from "lucide-react";
import { usePipeline } from "../../state/PipelineContext";

export function ModelSettingsModal({ onClose }: { onClose: () => void }) {
  const { health, loadModel, modelLoading, modelError } = usePipeline();
  const [backbone, setBackbone] = useState<"resnet50" | "resnet101">("resnet50");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLoad = async () => {
    if (!selectedFile) return;
    try {
      await loadModel(selectedFile, backbone);
    } catch {
      /* error surfaced via modelError */
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-[440px] flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="font-bold text-[16px] text-[#0f172a]">Model & Parameters</p>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-[#0f172a]">
            <X size={18} />
          </button>
        </div>

        <p className="text-[12px] text-[#475569]">
          Load the checkpoint saved by <code className="bg-[#f1f5f9] px-1 rounded">train.py</code> during
          your Colab run (<code className="bg-[#f1f5f9] px-1 rounded">best.pt</code> or{" "}
          <code className="bg-[#f1f5f9] px-1 rounded">last.pt</code>) to enable real segmentation.
        </p>

        {/* Backbone selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-[#475569] uppercase">Backbone</label>
          <div className="flex gap-2">
            {(["resnet50", "resnet101"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBackbone(b)}
                className={`px-3 py-1.5 rounded-md text-[12px] font-semibold border ${
                  backbone === b
                    ? "bg-[#3b82f6] text-white border-[#3b82f6]"
                    : "bg-white text-[#475569] border-[#e2e8f0]"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* File picker */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-[#475569] uppercase">Checkpoint (.pt)</label>
          <div
            onClick={() => inputRef.current?.click()}
            className="border border-dashed border-[#cbd5e1] rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-[#3b82f6] transition-colors"
          >
            <UploadCloud size={20} className="text-[#94a3b8]" />
            <p className="text-[12px] text-[#475569]">
              {selectedFile ? selectedFile.name : "Click to choose a .pt file"}
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".pt,.pth"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        {modelError && (
          <p className="text-[11px] text-[#ef4444] bg-[#fee2e2] rounded-md p-2">{modelError}</p>
        )}

        {health?.model_loaded && (
          <div className="flex items-center gap-2 text-[11px] text-[#166534] bg-[#dcfce7] rounded-md p-2">
            <CheckCircle2 size={14} />
            Currently loaded: {health.checkpoint_name} ({health.backbone}) on {health.device}
          </div>
        )}

        <button
          onClick={handleLoad}
          disabled={!selectedFile || modelLoading}
          className="bg-[#3b82f6] disabled:bg-[#93c5fd] disabled:cursor-not-allowed text-white font-bold text-[13px] rounded-md py-2.5 flex items-center justify-center gap-2"
        >
          {modelLoading ? <Loader2 size={14} className="animate-spin" /> : null}
          {modelLoading ? "Loading checkpoint..." : "Load Model"}
        </button>
      </div>
    </div>
  );
}
