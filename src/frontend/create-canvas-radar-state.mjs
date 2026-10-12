import { selectDefaultRadarRange } from "./radar-range.mjs";

export function createCanvasRadarState(state, draw, distances, viewChanges) {
  return {
    northAngle: () => state.rotation,
    reset() {
      state.autoZoom = true;
      state.range = selectDefaultRadarRange(distances());
      state.offsetX = 0;
      state.offsetY = 0;
      state.rotation = 0;
      draw();
    },
    range: () => state.range,
    onViewChange: (listener) => viewChanges.subscribe(listener),
  };
}
