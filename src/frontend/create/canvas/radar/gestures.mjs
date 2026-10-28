import { clampRadarRange } from "../../../radar/clamp-range.mjs";

export function createCanvasRadarGestures(state, draw) {
  return {
    onZoom(factor) {
      state.autoZoom = false;
      state.range = clampRadarRange(state.range * factor);
      draw();
    },
    onRotate(angle) {
      state.rotation += angle;
      draw();
    },
  };
}
