import { default as drawWaterOutlines } from "./outlines.mjs";

function drawCanvasRadarWater(ctx, visible, paths, project, location, width, height) {
  if (visible) drawWaterOutlines(ctx, paths, project, location, width, height);
}
export default drawCanvasRadarWater;
