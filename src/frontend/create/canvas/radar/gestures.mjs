import { default as clampRadarRange } from "../../../radar/clamp-range.mjs";

function createCanvasRadarGestures(state, draw) {
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
export default createCanvasRadarGestures;
