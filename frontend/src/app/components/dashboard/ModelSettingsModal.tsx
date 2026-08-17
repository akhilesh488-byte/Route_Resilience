/**
 * ModelSettingsModal.tsx
 * =======================
 * Neural architecture & checkpoint loader modal for DeepLabV3+ model weights.
 */

import { useRef, useState } from "react";
import { X, UploadCloud, CheckCircle2, Loader2, Cpu, AlertCircle } from "lucide-react";
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
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-[480px] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900 text-white shadow-sm">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="font-bold text-[16.5px] text-slate-900">
                Model Weights &amp; Architecture
              </h3>
              <p className="text-[12px] text-slate-500 font-medium">
                Load trained DeepLabV3+ PyTorch weights (.pt)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 flex flex-col gap-5 text-[13px] text-slate-600">
          {/* Active Model Status */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                Current Loaded Model
              </span>
              <span className="font-semibold text-slate-800 text-[13px]">
                {health?.checkpoint_name ?? "Untrained Head (ImageNet Backbone)"}
              </span>
            </div>
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                health?.model_loaded
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {health?.model_loaded ? "Custom Weights" : "Untrained"}
            </span>
          </div>

          {/* Architecture Selector */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-slate-800 text-[12.5px]">
              Backbone Architecture
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setBackbone("resnet50")}
                className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                  backbone === "resnet50"
                    ? "border-emerald-600 bg-emerald-50/60 shadow-xs"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                }`}
              >
                <span className="font-bold text-[13px] text-slate-900">ResNet-50</span>
                <span className="text-[11px] text-slate-500">Standard / Faster inference</span>
              </button>

              <button
                type="button"
                onClick={() => setBackbone("resnet101")}
                className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                  backbone === "resnet101"
                    ? "border-emerald-600 bg-emerald-50/60 shadow-xs"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                }`}
              >
                <span className="font-bold text-[13px] text-slate-900">ResNet-101</span>
                <span className="text-[11px] text-slate-500">Deeper / High-capacity</span>
              </button>
            </div>
          </div>

          {/* Checkpoint File Dropzone */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-slate-800 text-[12.5px]">
              Checkpoint File (.pt / .pth)
            </label>
            <div
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50/50 hover:bg-emerald-50/20 transition-all text-center"
            >
              <UploadCloud size={24} className="text-slate-400" />
              {selectedFile ? (
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[13px]">
                  <CheckCircle2 size={16} />
                  <span>{selectedFile.name}</span>
                </div>
              ) : (
                <>
                  <p className="text-[12.5px] font-semibold text-slate-700">
                    Click to select your trained <code className="text-emerald-700 font-mono">best.pt</code>
                  </p>
                  <p className="text-[11px] text-slate-400">Trained from Colab train.py script</p>
                </>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".pt,.pth"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {/* Error display */}
          {modelError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[12px]">
              <AlertCircle size={15} className="shrink-0" />
              <span>{modelError}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 text-[12.5px] font-semibold rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLoad}
            disabled={!selectedFile || modelLoading}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white text-[12.5px] font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            {modelLoading ? <Loader2 size={15} className="animate-spin" /> : null}
            <span>{modelLoading ? "Loading Checkpoint..." : "Load Weights"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
