import { drawCanvasRadar } from "./draw-canvas-radar.mjs";

export function createCanvasRadarDraw({
  context,
  canvas,
  targets,
  location,
  state,
  windowRef,
  trails,
  airports,
  navaids,
  boundaries,
}) {
  return () =>
    drawCanvasRadar(
      context,
      canvas,
      targets.items(),
      location,
      state.range,
      state.offsetX,
      state.offsetY,
      windowRef,
      state.rotation,
      trails,
      state.connected,
      airports,
      navaids,
      boundaries,
    );
}
