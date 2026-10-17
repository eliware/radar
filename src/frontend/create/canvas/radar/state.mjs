import { clampRadarRange, selectDefaultRadarRange } from "../../../radar/range.mjs";

export function createCanvasRadarState(state, draw, distances, viewChanges) {
  return {
    northAngle: () => state.rotation,
    reset() {
      state.autoZoom = true;
      state.range = selectDefaultRadarRange(distances(), state.defaultRangeNm);
      state.offsetX = 0;
      state.offsetY = 0;
      state.rotation = state.defaultRotationRadians ?? 0;
      draw();
    },
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
