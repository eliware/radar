import { createWaterOutlineLoader } from "./water-outline-loader.mjs";
import { createWaterLayerControl } from "./create-water-layer-control.mjs";
import { getWaterFetch } from "./get-water-fetch.mjs";
import { createCanvasWaterViewRequester } from "./request-canvas-water-view.mjs";

export function createCanvasWater(documentRef, windowRef, location, canvas, state, data, redraw) {
  const loader = createWaterOutlineLoader(getWaterFetch(windowRef));
  const requester = createCanvasWaterViewRequester(location, canvas, state, loader, data, redraw);
  const control = createWaterLayerControl(documentRef, (visible) => {
    data.visible = visible;
    redraw();
  });
  return {
    data,
    update: requester.update,
    destroy() {
      loader.cancel();
      control.destroy();
    },
  };
}
