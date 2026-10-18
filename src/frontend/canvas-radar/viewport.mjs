import { createRadarViewport } from "../radar/reference/viewport.mjs";

export function getRadarCanvasViewport(canvas, state) {
  return createRadarViewport(
    canvas.clientWidth,
    canvas.clientHeight,
    state.range,
    state.offsetX,
    state.offsetY,
    state.rotation,
  );
}
