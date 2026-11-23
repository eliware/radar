import { default as createCanvasRadarView } from "../../canvas-radar/view.mjs";

function createRadarFallback(error, options) {
  if (!/WebGL context|WebGL2|WebGL unavailable/i.test(error.message)) throw error;
  return createCanvasRadarView(options);
}
export default createRadarFallback;
