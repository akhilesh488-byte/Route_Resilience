"""
app.py
======
FastAPI backend that bridges the GIS Road Network dashboard frontend to the
occlusion-robust road extraction + graph-theoretic criticality pipeline.

Run it from the `road_pipeline/` directory:
    uvicorn backend.app:app --reload --port 8000

Endpoints (all under /api):
    GET  /health                    -- liveness + whether a model checkpoint is loaded
    POST /model/load                -- upload a trained .pt checkpoint (from your Colab run)
    POST /pipeline/run              -- upload a satellite tile (or a precomputed mask) and
                                        run the FULL pipeline in one shot: segmentation ->
                                        graph extraction -> healing -> centrality -> ablation.
                                        Returns everything the dashboard needs to render.
    POST /jobs/{job_id}/whatif      -- single-node "what if we lose this junction" simulation
    GET  /jobs/{job_id}/export/gexf -- download the healed graph as a GEXF file
    GET  /jobs/{job_id}/export/report -- download a JSON summary report
    GET  /jobs/{job_id}/files/{name}  -- serves the stored image/mask PNGs for a job

Job state (uploaded image, computed graphs, etc.) is kept in an in-memory
dict. That's intentional: this is a single-analyst hackathon/demo tool, not
a multi-tenant SaaS product, so a DB would be overkill. Restarting the
server clears jobs -- if you need persistence, look at JOB_STORE below.
"""

import io
import json
import time
import uuid
from pathlib import Path
from typing import Dict, Optional

import networkx as nx
import numpy as np
import torch
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, Response
from PIL import Image

from pipeline.model import build_model
from pipeline.mask_to_graph import build_graph_from_mask
from pipeline.graph_healing import heal_graph, connectivity_ratio
from pipeline.centrality import compute_betweenness_centrality, top_gatekeeper_nodes
from pipeline.resilience import (
    run_dynamic_ablation,
    run_static_ablation,
    simulate_single_node_failure,
    global_efficiency,
)

from .graph_utils import serialize_graph, graph_to_gexf_bytes

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------
app = FastAPI(title="ORRE-GTC Pipeline API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # local hackathon tool -- tighten this for a real deployment
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).resolve().parent / "jobs"
DATA_DIR.mkdir(exist_ok=True)

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# ---------------------------------------------------------------------------
# Global model state (single shared model instance for this local server)
# ---------------------------------------------------------------------------
class ModelState:
    def __init__(self):
        self.model: Optional[torch.nn.Module] = None
        self.backbone: str = "resnet50"
        self.checkpoint_name: Optional[str] = None
        self.loaded_at: Optional[str] = None

    def is_loaded(self) -> bool:
        return self.model is not None


MODEL_STATE = ModelState()

# In-memory job store: job_id -> dict with graphs, paths, results.
JOB_STORE: Dict[str, Dict] = {}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _job_dir(job_id: str) -> Path:
    d = DATA_DIR / job_id
    d.mkdir(parents=True, exist_ok=True)
    return d


def _run_segmentation(image: np.ndarray, threshold: float = 0.5):
    """Runs the loaded DeepLabV3+ model on an RGB uint8 [H,W,3] image."""
    if MODEL_STATE.model is None:
        raise HTTPException(
            status_code=409,
            detail="No model checkpoint is loaded yet. Train the model in Colab, then "
                   "POST the resulting .pt file to /api/model/load -- or upload a "
                   "precomputed binary mask instead of a raw image to skip segmentation.",
        )

    tensor = torch.from_numpy(image.astype(np.float32) / 255.0).permute(2, 0, 1).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        logits = MODEL_STATE.model(tensor)
        probs = torch.sigmoid(logits)

    prob_map = probs.squeeze().cpu().numpy()
    binary_mask = (prob_map >= threshold).astype(np.uint8)
    return prob_map, binary_mask


def _save_png(arr: np.ndarray, path: Path):
    """Saves a [0,1] float array or {0,1} uint8 array as a viewable grayscale PNG."""
    img = (np.clip(arr, 0, 1) * 255).astype(np.uint8)
    Image.fromarray(img).save(path)


def _build_summary(job: Dict) -> Dict:
    healed = job["healed_graph"]
    raw = job["raw_graph"]
    ablation = job["ablation"]
    centrality = job["centrality"]
    top_nodes = job["top_nodes"]

    max_bc = top_nodes[0][1] if top_nodes else 0.0

    return {
        "job_id": job["job_id"],
        "created_at": job["created_at"],
        "image": {"width": job["width"], "height": job["height"]},
        "kpis": {
            "connectivity_ratio_pct": job["connectivity_ratio_pct"],
            "total_nodes": healed.number_of_nodes(),
            "total_edges": healed.number_of_edges(),
            "global_efficiency": global_efficiency(healed),
            "resilience_index": ablation["resilience_index"],
            "max_betweenness_centrality": max_bc,
        },
        "raw_graph_counts": {
            "nodes": raw.number_of_nodes(),
            "edges": raw.number_of_edges(),
        },
        "mean_segmentation_confidence": job.get("mean_confidence"),
        "healed_edges_added": job["healed_edges_added"],
    }


# ---------------------------------------------------------------------------
# Health / model endpoints
# ---------------------------------------------------------------------------
@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "device": DEVICE,
        "model_loaded": MODEL_STATE.is_loaded(),
        "checkpoint_name": MODEL_STATE.checkpoint_name,
        "backbone": MODEL_STATE.backbone,
    }


@app.post("/api/model/load")
async def load_model(checkpoint: UploadFile = File(...), backbone: str = Form("resnet50")):
    """
    Upload the .pt checkpoint saved by train.py (best.pt or last.pt from
    your Colab run's checkpoint directory).
    """
    try:
        raw_bytes = await checkpoint.read()
        buffer = io.BytesIO(raw_bytes)
        ckpt = torch.load(buffer, map_location=DEVICE)

        state_dict = ckpt["model_state"] if isinstance(ckpt, dict) and "model_state" in ckpt else ckpt

        model = build_model(num_classes=1, backbone=backbone, pretrained=False)
        model.load_state_dict(state_dict)
        model.to(DEVICE)
        model.eval()

        MODEL_STATE.model = model
        MODEL_STATE.backbone = backbone
        MODEL_STATE.checkpoint_name = checkpoint.filename
        MODEL_STATE.loaded_at = time.strftime("%Y-%m-%d %H:%M:%S")

        return {"status": "loaded", "checkpoint_name": checkpoint.filename, "backbone": backbone}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to load checkpoint: {e}")


# ---------------------------------------------------------------------------
# Full pipeline run
# ---------------------------------------------------------------------------
@app.post("/api/pipeline/run")
async def run_pipeline_endpoint(
    image: Optional[UploadFile] = File(None),
    mask: Optional[UploadFile] = File(None),
    seg_threshold: float = Form(0.5),
    max_gap_distance: float = Form(60.0),
    angle_weight: float = Form(40.0),
    ablation_mode: str = Form("dynamic"),
    ablation_step: float = Form(0.02),
):
    """
    The single endpoint the "Upload New Data" button calls. Runs the whole
    Phase I -> II -> III pipeline and returns one JSON payload with
    everything the dashboard renders: KPIs, both graphs, centrality
    rankings, and the resilience/ablation curve.

    Provide EITHER `image` (a raw satellite tile -- runs the segmentation
    model) OR `mask` (a precomputed binary road mask -- skips segmentation
    entirely, useful before your Colab training run finishes).
    """
    if image is None and mask is None:
        raise HTTPException(status_code=400, detail="Provide either an 'image' or a 'mask' file.")

    job_id = uuid.uuid4().hex[:12]
    job_path = _job_dir(job_id)

    mean_confidence = None

    if mask is not None:
        mask_bytes = await mask.read()
        mask_img = Image.open(io.BytesIO(mask_bytes)).convert("L")
        binary_mask = (np.array(mask_img) > 127).astype(np.uint8)
        height, width = binary_mask.shape
        # No satellite preview available in mask-only mode; store the mask as
        # the "input" preview too so the UI has something to show.
        _save_png(binary_mask.astype(np.float32), job_path / "input.png")
    else:
        image_bytes = await image.read()
        pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        pil_img.save(job_path / "input.png")
        image_arr = np.array(pil_img)
        height, width = image_arr.shape[:2]

        prob_map, binary_mask = _run_segmentation(image_arr, threshold=seg_threshold)
        mean_confidence = float(prob_map[binary_mask.astype(bool)].mean()) if binary_mask.any() else float(prob_map.mean())

    _save_png(binary_mask.astype(np.float32), job_path / "mask.png")

    # ---- Phase II: graph extraction + healing ------------------------------
    raw_graph = build_graph_from_mask(binary_mask)
    healed_graph = heal_graph(raw_graph, max_gap_distance=max_gap_distance, angle_weight=angle_weight)
    ratio_pct = connectivity_ratio(raw_graph, healed_graph)
    healed_edges_added = healed_graph.number_of_edges() - raw_graph.number_of_edges()

    # ---- Phase III: centrality + ablation -----------------------------------
    centrality = compute_betweenness_centrality(healed_graph, weight="weight")
    top_nodes = top_gatekeeper_nodes(centrality, top_n=15)

    ablation_fn = run_dynamic_ablation if ablation_mode == "dynamic" else run_static_ablation
    ablation = ablation_fn(healed_graph, removal_fraction_step=ablation_step, weight="weight")

    # ---- Persist job state for follow-up calls (what-if, export) ----------
    JOB_STORE[job_id] = {
        "job_id": job_id,
        "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "width": int(width),
        "height": int(height),
        "raw_graph": raw_graph,
        "healed_graph": healed_graph,
        "connectivity_ratio_pct": ratio_pct,
        "healed_edges_added": healed_edges_added,
        "centrality": centrality,
        "top_nodes": top_nodes,
        "ablation": ablation,
        "mean_confidence": mean_confidence,
        "job_path": str(job_path),
    }

    response = {
        "job_id": job_id,
        "summary": _build_summary(JOB_STORE[job_id]),
        "raw_graph": serialize_graph(raw_graph),
        "healed_graph": serialize_graph(healed_graph),
        "centrality": {
            "top_nodes": [
                {"rank": i + 1, "node_id": str(n), "score": float(s), "degree": int(healed_graph.degree(n))}
                for i, (n, s) in enumerate(top_nodes)
            ],
        },
        "ablation": {
            "removed_fractions": ablation["removed_fractions"],
            "gcc_fractions": ablation["gcc_fractions"],
            "global_efficiencies": ablation["global_efficiencies"],
            "resilience_index": ablation["resilience_index"],
        },
        "files": {
            "input_image": f"/api/jobs/{job_id}/files/input.png",
            "mask_image": f"/api/jobs/{job_id}/files/mask.png",
        },
    }
    return JSONResponse(response)


# ---------------------------------------------------------------------------
# What-if single-node removal
# ---------------------------------------------------------------------------
@app.post("/api/jobs/{job_id}/whatif")
def whatif(job_id: str, node_id: str = Form(...)):
    job = JOB_STORE.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Unknown job_id -- run the pipeline first.")

    G = job["healed_graph"]
    if node_id not in G:
        # Node ids come back as ints from networkx but strings over the wire.
        try:
            node_id_typed = int(node_id)
        except ValueError:
            node_id_typed = node_id
    else:
        node_id_typed = node_id

    if node_id_typed not in G:
        raise HTTPException(status_code=404, detail=f"Node {node_id!r} not found in the healed graph.")

    impact = simulate_single_node_failure(G, node_id_typed, weight="weight")

    G_after = G.copy()
    G_after.remove_node(node_id_typed)

    return {
        "node_id": str(node_id_typed),
        "impact": impact,
        "before_graph": serialize_graph(G),
        "after_graph": serialize_graph(G_after),
    }


# ---------------------------------------------------------------------------
# Exports
# ---------------------------------------------------------------------------
@app.get("/api/jobs/{job_id}/export/gexf")
def export_gexf(job_id: str):
    job = JOB_STORE.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Unknown job_id.")

    gexf_bytes = graph_to_gexf_bytes(job["healed_graph"])
    return Response(
        content=gexf_bytes,
        media_type="application/gexf+xml",
        headers={"Content-Disposition": f'attachment; filename="healed_graph_{job_id}.gexf"'},
    )


@app.get("/api/jobs/{job_id}/export/report")
def export_report(job_id: str):
    job = JOB_STORE.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Unknown job_id.")

    report = _build_summary(job)
    report["top_gatekeeper_nodes"] = [
        {"rank": i + 1, "node_id": str(n), "score": float(s)}
        for i, (n, s) in enumerate(job["top_nodes"])
    ]
    report["ablation"] = {
        "resilience_index": job["ablation"]["resilience_index"],
        "removed_fractions": job["ablation"]["removed_fractions"],
        "gcc_fractions": job["ablation"]["gcc_fractions"],
    }

    payload = json.dumps(report, indent=2).encode("utf-8")
    return Response(
        content=payload,
        media_type="application/json",
        headers={"Content-Disposition": f'attachment; filename="pipeline_report_{job_id}.json"'},
    )


@app.get("/api/jobs/{job_id}/files/{filename}")
def get_job_file(job_id: str, filename: str):
    job = JOB_STORE.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Unknown job_id.")
    file_path = Path(job["job_path"]) / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found.")
    return FileResponse(file_path)
