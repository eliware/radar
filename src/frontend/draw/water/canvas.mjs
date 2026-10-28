import { drawWaterOutlines } from "./outlines.mjs";

export function drawCanvasRadarWater(ctx, visible, paths, project, location, width, height) {
  if (visible) drawWaterOutlines(ctx, paths, project, location, width, height);
}
