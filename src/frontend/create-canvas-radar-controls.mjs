import { clampRadarRange, selectDefaultRadarRange } from "./radar-range.mjs";

export function createCanvasRadarControls(state, draw, distances) {
  return {
    zoom(factor) {
      state.autoZoom = false;
      state.range = clampRadarRange(state.range * factor);
      draw();
    },
    rotate(direction) {
      state.rotation += direction * (Math.PI / 12);
      draw();
    },
    rotateBy(angle) {
      state.rotation += angle;
      draw();
    },
    orbitBy(azimuth) {
      state.rotation += azimuth;
      draw();
    },
    northAngle: () => state.rotation,
    reset() {
      state.autoZoom = true;
      state.range = selectDefaultRadarRange(distances());
      state.offsetX = 0;
      state.offsetY = 0;
      state.rotation = 0;
      draw();
    },
  };
}
