import { createWaterOutlineLoader } from "./water-outline-loader.mjs";
import { createWaterVisibility } from "./create-water-visibility.mjs";
import { getWaterFetch } from "./get-water-fetch.mjs";
import { createCanvasWaterViewRequester } from "./request-canvas-water-view.mjs";

export function createCanvasWater(documentRef, windowRef, location, canvas, state, data, redraw) {
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
