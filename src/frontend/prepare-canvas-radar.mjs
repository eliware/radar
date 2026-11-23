import { default as resizeCanvasBackingStore } from "./canvas/resize.mjs";

function prepareCanvasRadar(context, canvas, windowRef) {
  const width = canvas.clientWidth || 1;
  const height = canvas.clientHeight || 1;
  const ratio = Math.min(windowRef.devicePixelRatio || 1, 2);
  resizeCanvasBackingStore(canvas, context, width, height, ratio);
  return { width, height };
}
export default prepareCanvasRadar;
