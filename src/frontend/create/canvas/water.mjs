import { default as createWaterOutlineLoader } from "../../water/outline-loader.mjs";
import { default as createWaterVisibility } from "../water/visibility.mjs";
import { default as getWaterFetch } from "../../get-water-fetch.mjs";
import { default as createCanvasWaterViewRequester } from "../../request-canvas-water-view.mjs";

function createCanvasWater(documentRef, windowRef, location, canvas, state, data, redraw) {
  const loader = createWaterOutlineLoader(getWaterFetch(windowRef));
  const requester = createCanvasWaterViewRequester(location, canvas, state, loader, data, redraw);
  const visibility = createWaterVisibility(documentRef, (visible) => {
    data.visible = visible;
    redraw();
  });
  data.visible = visibility.isVisible();
  return {
    data,
    update: requester.update,
    destroy() {
      loader.cancel();
      visibility.destroy();
    },
  };
}
export default createCanvasWater;
