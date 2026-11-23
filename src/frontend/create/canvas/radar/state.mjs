import { default as clampRadarRange } from "../../../radar/clamp-range.mjs";
import { default as resetCanvasRadarView } from "./reset.mjs";

function createCanvasRadarState(state, draw, distances, viewChanges) {
  return {
    northAngle: () => state.rotation,
    reset: () => resetCanvasRadarView(state, draw, distances),
    range: () => state.range,
    zoomBy(factor) {
      state.autoZoom = false;
      state.range = clampRadarRange(state.range * factor);
      draw();
    },
    rotateBy(angle) {
      state.rotation += angle;
      draw();
    },
    setRotation(angle) {
      state.rotation = -angle;
      draw();
    },
    onViewChange: (listener) => viewChanges.subscribe(listener),
  };
}
export default createCanvasRadarState;
