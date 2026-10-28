import { createCanvasRadarView } from "../../canvas-radar/view.mjs";

export function createRadarFallback(error, options) {
  if (!/WebGL context|WebGL2|WebGL unavailable/i.test(error.message)) throw error;
  return createCanvasRadarView(options);
}
