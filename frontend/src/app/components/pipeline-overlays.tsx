import imgSatellite from "@/imports/GisRoadNetworkDashboard/86df414468f2616189300afb79f5d1686cb02777.png";

// Road coordinates in a shared 220×100 viewBox so Step 3 and Step 4 are visually consistent.
// The gap runs from x=72 → x=112 (the occluded canopy zone).
const ROAD_A_LEFT  = { x1:   0, y1: 46, x2:  72, y2: 50 };
const ROAD_A_RIGHT = { x1: 112, y1: 47, x2: 220, y2: 41 };
const CROSS_L      = { x1:  54, y1:  6, x2:  48, y2: 94 };
const CROSS_R      = { x1: 138, y1:  4, x2: 143, y2: 90 };
const GAP          = { x1:  72, y1: 50, x2: 112, y2: 47 };

const SATELLITE_STYLE: React.CSSProperties = {
  position: "absolute", inset: 0, width: "100%", height: "100%",
  objectFit: "cover", opacity: 0.78,
};

const DARK_VEIL: React.CSSProperties = {
  position: "absolute", inset: 0, background: "rgba(0,0,0,0.30)",
};

const SVG_STYLE: React.CSSProperties = {
  position: "absolute", inset: 0, width: "100%", height: "100%",
};

function RoadLines({ opacity = 0.9 }: { opacity?: number }) {
  return (
    <>
      <line {...ROAD_A_LEFT}  stroke="#86EFAC" strokeWidth="2.5" strokeLinecap="round" opacity={opacity} />
      <line {...ROAD_A_RIGHT} stroke="#86EFAC" strokeWidth="2.5" strokeLinecap="round" opacity={opacity} />
      <line {...CROSS_L}      stroke="#86EFAC" strokeWidth="1.5" strokeLinecap="round" opacity={opacity * 0.78} />
      <line {...CROSS_R}      stroke="#86EFAC" strokeWidth="1.5" strokeLinecap="round" opacity={opacity * 0.78} />
    </>
  );
}

const LEGEND_WRAP: React.CSSProperties = {
  position: "absolute", bottom: 4, right: 5,
  display: "flex", gap: 6, alignItems: "center",
  background: "rgba(0,0,0,0.68)", padding: "2px 6px", borderRadius: 3,
  fontFamily: "sans-serif",
};

const LEGEND_LABEL: React.CSSProperties = { display: "flex", alignItems: "center", gap: 3 };
const LEGEND_TEXT: React.CSSProperties  = { fontSize: "5.5px", color: "#fff" };

// ─── Step 3: Raw topology on satellite — gap clearly visible ──────────────────

export function RawTopologyOverlay() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 10, borderRadius: 6, overflow: "hidden" }}>
      <img src={imgSatellite} alt="" style={SATELLITE_STYLE} />
      <div style={DARK_VEIL} />

      <svg style={SVG_STYLE} viewBox="0 0 220 100" preserveAspectRatio="none">
        <RoadLines />

        {/* Dashed gap — visually obvious break in the route */}
        <line {...GAP}
          stroke="#F87171" strokeWidth="1.5"
          strokeDasharray="3,2.5" strokeLinecap="round" opacity="0.95"
        />

        {/* Endpoint nodes — red = unresolved junction */}
        <circle cx={GAP.x1} cy={GAP.y1} r="3"   fill="#EF4444" />
        <circle cx={GAP.x2} cy={GAP.y2} r="3"   fill="#EF4444" />
        <circle cx="48"     cy="46"     r="2.5"  fill="#EF4444" opacity="0.85" />
        <circle cx="143"    cy="41"     r="2.5"  fill="#EF4444" opacity="0.85" />
      </svg>

      {/* Occlusion gap badge */}
      <div style={{
        position: "absolute", left: "41%", top: "10%",
        transform: "translateX(-50%)",
        background: "rgba(239,68,68,0.88)", color: "#fff",
        fontSize: "6px", fontWeight: 700, letterSpacing: "0.07em",
        padding: "2px 5px", borderRadius: 3,
        whiteSpace: "nowrap", lineHeight: 1.3,
        fontFamily: "sans-serif",
      }}>
        ▼ OCCLUSION GAP
      </div>

      {/* Legend */}
      <div style={LEGEND_WRAP}>
        <div style={LEGEND_LABEL}>
          <div style={{ width: 9, height: 2, background: "#86EFAC" }} />
          <span style={LEGEND_TEXT}>Road</span>
        </div>
        <div style={LEGEND_LABEL}>
          <svg width="9" height="5" viewBox="0 0 9 5">
            <line x1="0" y1="2.5" x2="9" y2="2.5"
              stroke="#F87171" strokeWidth="1.5" strokeDasharray="2.5,1.5" />
          </svg>
          <span style={{ ...LEGEND_TEXT, color: "#F87171" }}>Gap</span>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Healed graph on satellite — cyan bridge fills the gap ────────────

export function HealedGraphOverlay() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 10, borderRadius: 6, overflow: "hidden" }}>
      <img src={imgSatellite} alt="" style={SATELLITE_STYLE} />
      <div style={DARK_VEIL} />

      <svg style={SVG_STYLE} viewBox="0 0 220 100" preserveAspectRatio="none">
        {/* Existing roads — same geometry as Step 3 */}
        <RoadLines opacity={0.88} />

        {/*
          Healed bridge — layered glow (no SVG filter so overflow-clip never clips it).
          Outer halo → mid ring → bright core.
        */}
        <line {...GAP} stroke="#06B6D4" strokeWidth="12" opacity="0.10" strokeLinecap="round" />
        <line {...GAP} stroke="#06B6D4" strokeWidth="8"  opacity="0.20" strokeLinecap="round" />
        <line {...GAP} stroke="#22D3EE" strokeWidth="5"  opacity="0.42" strokeLinecap="round" />
        <line {...GAP} stroke="#A5F3FC" strokeWidth="2.5" opacity="1"   strokeLinecap="round" />

        {/* Healed endpoint nodes — green with cyan ring */}
        <circle cx={GAP.x1} cy={GAP.y1} r="4.5" fill="#10B981" stroke="#A5F3FC" strokeWidth="1.5" />
        <circle cx={GAP.x2} cy={GAP.y2} r="4.5" fill="#10B981" stroke="#A5F3FC" strokeWidth="1.5" />
        {/* Standard road nodes */}
        <circle cx="48"  cy="46" r="2.5" fill="#10B981" opacity="0.85" />
        <circle cx="143" cy="41" r="2.5" fill="#10B981" opacity="0.85" />
      </svg>

      {/*
        Callout bubble — center sits at ~40% from left, which aligns with the gap midpoint
        at x=(72+112)/2=92 → 92/220 ≈ 41.8% of width.
        Top: 4px; bubble ~24px tall; connector ~24px → tip lands at ~52px = near y≈50px.
      */}
      <div style={{
        position: "absolute",
        left: "41%",
        top: 4,
        transform: "translateX(-50%)",
        zIndex: 20,
      }}>
        <div style={{
          background: "rgba(8,145,178,0.94)",
          border: "1px solid #67E8F9",
          borderRadius: 4,
          padding: "3px 7px",
          whiteSpace: "nowrap",
          lineHeight: 1.5,
          boxShadow: "0 0 10px rgba(6,182,212,0.55)",
          fontFamily: "sans-serif",
        }}>
          <div style={{ color: "#fff", fontSize: "6.5px", fontWeight: 700, letterSpacing: "0.04em" }}>
            ⚡ Occlusion Gap Repaired
          </div>
          <div style={{ color: "#A5F3FC", fontSize: "5.5px", fontWeight: 400 }}>
            45m bridge · 12° alignment
          </div>
        </div>

        {/* Connector line from callout to the bridge */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: "100%",
          width: 1,
          height: 24,
          background: "linear-gradient(to bottom, #67E8F9, rgba(103,232,249,0))",
          opacity: 0.9,
        }} />
        {/* Arrow head */}
        <div style={{
          position: "absolute",
          left: "calc(50% - 3px)",
          top: "calc(100% + 24px)",
          borderLeft: "3px solid transparent",
          borderRight: "3px solid transparent",
          borderTop: "4px solid #67E8F9",
          opacity: 0.85,
        }} />
      </div>

      {/* Legend */}
      <div style={LEGEND_WRAP}>
        <div style={LEGEND_LABEL}>
          <div style={{ width: 9, height: 2, background: "#86EFAC" }} />
          <span style={LEGEND_TEXT}>Road</span>
        </div>
        <div style={LEGEND_LABEL}>
          <div style={{ width: 9, height: 2, background: "#A5F3FC", boxShadow: "0 0 4px #06B6D4" }} />
          <span style={{ ...LEGEND_TEXT, color: "#A5F3FC" }}>Healed</span>
        </div>
      </div>
    </div>
  );
}
