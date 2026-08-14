# Occlusion-Robust Road Extraction & Graph-Theoretic Criticality Pipeline

End-to-end PyTorch + NetworkX pipeline for the ISRO/NNRMS-aligned hackathon
problem statement: extract routable road topology from occluded satellite
imagery, then identify structural bottlenecks and simulate infrastructure
failure. Every module is implemented **strictly** from the accompanying
research write-ups — nothing invented beyond what's needed to make the
specified algorithms runnable.

## Structure

```
road_pipeline/
├── main.py                    # End-to-end orchestration (CLI + importable)
├── requirements.txt
└── pipeline/
    ├── __init__.py
    ├── model.py                # Phase I: DeepLabV3+ (ResNet backbone) + ASPP
    ├── losses.py                # Phase I: Soft-Skeleton + Dice/clDice hybrid loss
    ├── mask_to_graph.py         # Phase II: mask -> skeleton -> NetworkX graph
    ├── graph_healing.py         # Phase II: MST + Disjoint Set topological healing
    ├── centrality.py            # Phase III: Betweenness Centrality (Gatekeeper Nodes)
    └── resilience.py            # Phase III: Global Efficiency + Node Ablation
```

## Source mapping (what came from which research doc)

| Module | Research source | Key spec implemented |
|---|---|---|
| `model.py` | *DeepLabV3+ (ResNet Backbone) vs. DenseDDSSPP* | ResNet-50/101 + atrous conv (OS=16), 5-branch ASPP (d=6,12,18), decoder w/ 48-ch low-level skip |
| `losses.py` | *mathematical formulation and PyTorch code logic for topological loss functions* | `SoftSkeleton2D` (differentiable soft-erosion/dilation), `SoftDiceclDiceLoss` = (1-α)·Dice + α·clDice |
| `mask_to_graph.py` | *step-by-step logic for converting a 2D binary road mask into a graph...* | skimage skeletonize → Laplacian neighbor kernel node classification → CC centroid clustering → skeleton slicing → NetworkX graph |
| `graph_healing.py` | *algorithmic logic for graph healing* + problem statement Phase II | Disjoint-Set + Kruskal-style MST healing restricted to degree-1 endpoints, cost = distance + angular tangent-alignment penalty (avoids "ghost connections") |
| `centrality.py` | *Python implementation logic using NetworkX to calculate Betweenness Centrality...* | Exact Brandes' algorithm below a node-count threshold, pivot-sampling approximation above it, degree-2 chain simplification preprocessing |
| `resilience.py` | *mathematical formula for 'Global Network Efficiency' and pseudo-code for a 'Node Ablation' simulation* | `E(G)`, dynamic (sequential) + static node ablation, trapezoidal Resilience Index (AUC of GCC curve), single-node "what-if" simulation for the dashboard |

## Training (Colab, ~15GB VRAM)

Dataset: [DeepGlobe Road Extraction Dataset](https://www.kaggle.com/datasets/balraj98/deepglobe-road-extraction-dataset)
(~4GB, 6226 paired `*_sat.jpg` / `*_mask.png` tiles — no manual mask-making needed).

```python
# In Colab:
from google.colab import drive
drive.mount('/content/drive')   # checkpoints survive disconnects

files.upload()  # your kaggle.json
!mkdir -p ~/.kaggle && cp kaggle.json ~/.kaggle/ && chmod 600 ~/.kaggle/kaggle.json
!pip install -q kaggle
!kaggle datasets download -d balraj98/deepglobe-road-extraction-dataset
!unzip -q deepglobe-road-extraction-dataset.zip -d /content/deepglobe

!pip install -r requirements.txt

!python train.py \
    --data-root /content/deepglobe/train \
    --checkpoint-dir /content/drive/MyDrive/road_extraction_ckpts \
    --epochs 60 --batch-size 8 --img-size 512
```

`train.py` (uses `pipeline/dataset.py` for loading/augmentation):
- Mixed-precision (AMP) training to make the most of a 15GB GPU.
- Saves a named checkpoint every 10 epochs (`--checkpoint-every`), PLUS
  overwrites a `last.pt` every single epoch as a cheap extra safety net.
- **Auto-resumes** from `last.pt` if the script is re-run after a Colab
  disconnect — just re-run the same command.
- Tracks train/val loss and val IoU every epoch; at the end (or on Ctrl+C)
  saves `loss_vs_epoch.png` and `loss_history.csv` to the checkpoint dir.
- `best.pt` always holds the lowest-val-loss weights — use this in your
  project's inference code:
  ```python
  ckpt = torch.load("best.pt", map_location="cpu")
  model.load_state_dict(ckpt["model_state"])
  ```

If you hit CUDA OOM on Colab: lower `--batch-size` and raise `--accum-steps`
proportionally (e.g. `--batch-size 4 --accum-steps 2` keeps the same
effective batch size at half the memory), or drop `--img-size` to 384.

## Quick start

```bash
pip install -r requirements.txt

# Smoke test with zero real data (validates every module's wiring):
python main.py

# Full run once you have a trained checkpoint + a tile:
python main.py --image tile.png --checkpoint model.pt

# Skip segmentation entirely and heal/analyze a ground-truth OSM mask
# (useful for the graph sub-team to work in parallel with the DL sub-team,
# per the problem statement's suggested hackathon workflow):
python main.py --mask osm_ground_truth_mask.png
```

## Training loop sketch (not included as a standalone script — wire into your
own trainer)

```python
from pipeline.model import build_model
from pipeline.losses import SoftDiceclDiceLoss

model = build_model(num_classes=1, backbone="resnet50", pretrained=True)
criterion = SoftDiceclDiceLoss(alpha=0.5, num_iterations=3)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)

for images, masks in dataloader:
    logits = model(images)
    loss = criterion(logits, masks)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
```

## Notes / tuning knobs for the 30-hour window

- `PipelineConfig.backbone`: defaults to `resnet50` (not `resnet101`) for
  faster iteration; swap in `resnet101` only if you have GPU time to spare.
- `PipelineConfig.max_gap_distance` / `angle_weight`: tune the healing
  search radius and angle-vs-distance trade-off to your tile's GSD and
  typical canopy-gap size.
- `PipelineConfig.exact_centrality_threshold` / `approx_centrality_k`:
  controls the exact-vs-approximate Betweenness Centrality switch; lower
  the threshold if a city-scale graph is stalling.
- `PipelineConfig.ablation_mode`: `"static"` is much cheaper for demo
  iteration; switch to `"dynamic"` for the final, realistic worst-case
  Resilience Index number.

## Full-stack app (backend + frontend dashboard)

This project now includes a complete web app on top of the pipeline:

```
road_pipeline/
├── pipeline/       # (as above) the ML + graph-theory core
├── train.py        # (as above) Colab training script
├── backend/        # FastAPI service wrapping the pipeline for the UI
│   ├── app.py
│   └── graph_utils.py
└── frontend/        # React/Vite dashboard (from the Figma design)
    └── src/app/
        ├── lib/api.ts                    # typed backend client
        ├── state/PipelineContext.tsx     # all dashboard state lives here
        └── components/dashboard/         # KPI row, pipeline panels, charts, etc.
```

### Running it locally

**1. Backend** (from `road_pipeline/`):
```bash
pip install -r requirements.txt
uvicorn backend.app:app --reload --port 8000
```
Check it's up: `curl http://localhost:8000/api/health`

**2. Frontend** (from `road_pipeline/frontend/`):
```bash
npm install
npm run dev
```
Open the printed `http://localhost:5173` URL. The Vite dev server proxies
`/api/*` calls to the backend automatically — no `.env` file needed for
local dev (see `.env.example` if you ever run them on different hosts).

### Using your trained weights

1. Finish training on Colab (see the "Training" section above) — you'll end
   up with `best.pt` (and periodic `checkpoint_epoch_N.pt` files) in your
   Google Drive checkpoint folder.
2. Download `best.pt` to your machine.
3. In the dashboard, open **Model & Parameters** in the sidebar, pick the
   backbone you trained with (`resnet50` by default), upload `best.pt`,
   and click **Load Model**.
4. Click **Upload New Data** → **Satellite image** and pick a tile. The
   backend runs your trained model for segmentation, then the full
   graph-healing / centrality / resilience pipeline, and every panel in
   the dashboard updates with real results.

Before your checkpoint is ready, you can still exercise the entire graph
side of the dashboard: **Upload New Data** → **Precomputed mask**, and
point it at a binary road mask (e.g. from OSM ground truth) to skip
segmentation entirely.

### What's real vs. what was mocked

The original Figma export was fully static — every number and chart was
hardcoded placeholder markup with no state. Every data-bearing element in
the current `frontend/src/app/components/dashboard/` folder is now wired
to a live API call and renders actual pipeline output: KPI cards, all five
pipeline-stage panels, the resilience curve chart, the gatekeeper
centrality table, the what-if node-failure simulator, and both export
buttons (GEXF + JSON report). The old static mock
(`src/imports/GisRoadNetworkDashboard/`) is left in the repo for visual
reference but is no longer used by `App.tsx`.
