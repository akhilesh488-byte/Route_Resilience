/**
 * sampleData.ts
 * =============
 * Generates an interesting synthetic occluded road mask client-side on an offscreen canvas
 * and packages it as a PNG File object. Allows 1-click instant live demonstration
 * of the entire graph extraction, healing, centrality, and resilience pipeline.
 */

export function generateSampleRoadMask(): Promise<File> {
  return new Promise((resolve, reject) => {
    try {
      const size = 512;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Unable to create canvas context"));
        return;
      }

      // 1. Black background (no road)
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, size, size);

      // 2. White roads
      ctx.strokeStyle = "#ffffff";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Main Arterial Grid
      ctx.lineWidth = 14;
      
      // Horizontal highways
      ctx.beginPath();
      ctx.moveTo(30, 120);
      ctx.lineTo(480, 120);
      ctx.moveTo(30, 256);
      ctx.lineTo(480, 256);
      ctx.moveTo(30, 390);
      ctx.lineTo(480, 390);

      // Vertical highways
      ctx.moveTo(120, 30);
      ctx.lineTo(120, 480);
      ctx.moveTo(256, 30);
      ctx.lineTo(256, 480);
      ctx.moveTo(390, 30);
      ctx.lineTo(390, 480);
      ctx.stroke();

      // Secondary connectors & diagonals
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(120, 120);
      ctx.lineTo(390, 390);
      ctx.moveTo(390, 120);
      ctx.lineTo(256, 256);
      ctx.moveTo(256, 256);
      ctx.lineTo(120, 390);
      ctx.stroke();

      // Ring Road / Roundabout
      ctx.beginPath();
      ctx.arc(256, 256, 85, 0, Math.PI * 2);
      ctx.stroke();

      // Curved bypass
      ctx.beginPath();
      ctx.moveTo(30, 256);
      ctx.bezierCurveTo(90, 420, 200, 480, 256, 480);
      ctx.stroke();

      // 3. Occlusion gaps (Simulated tree canopy / cloud shadows breaking connectivity)
      ctx.fillStyle = "#000000";
      
      // Gap 1: Horizontal highway east of central junction
      ctx.beginPath();
      ctx.arc(320, 120, 22, 0, Math.PI * 2);
      ctx.fill();

      // Gap 2: Ring road northwest quadrant
      ctx.beginPath();
      ctx.arc(200, 200, 20, 0, Math.PI * 2);
      ctx.fill();

      // Gap 3: Vertical highway south
      ctx.beginPath();
      ctx.arc(256, 335, 24, 0, Math.PI * 2);
      ctx.fill();

      // Gap 4: Diagonal connector
      ctx.beginPath();
      ctx.arc(175, 345, 18, 0, Math.PI * 2);
      ctx.fill();

      // Convert canvas to PNG Blob -> File
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to convert canvas to blob"));
          return;
        }
        const file = new File([blob], "sample_occluded_road_tile.png", {
          type: "image/png",
        });
        resolve(file);
      }, "image/png");
    } catch (err) {
      reject(err);
    }
  });
}
