import { default as createRadarViewport } from "../radar/reference/viewport.mjs";

function getRadarCanvasViewport(canvas, state) {
  return createRadarViewport(
    canvas.clientWidth,
    canvas.clientHeight,
    state.range,
    state.offsetX,
    state.offsetY,
    state.rotation,
  );
}
export default getRadarCanvasViewport;
