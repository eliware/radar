import { clampRadarRange } from "../../../radar/clamp-range.mjs";
import { resetCanvasRadarView } from "./reset.mjs";

export function createCanvasRadarState(state, draw, distances, viewChanges) {
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
