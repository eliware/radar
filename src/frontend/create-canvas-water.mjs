import { createWaterOutlineLoader } from "./water-outline-loader.mjs";
import { createWaterLayerControl } from "./create-water-layer-control.mjs";
import { shiftWaterCenter } from "./shift-water-center.mjs";
import { getWaterFetch } from "./get-water-fetch.mjs";

export function createCanvasWater(documentRef, windowRef, location, canvas, state, data, redraw) {
  const loader = createWaterOutlineLoader(getWaterFetch(windowRef));
  let requestedView = "";
  const control = createWaterLayerControl(documentRef, (visible) => {
    data.visible = visible;
    redraw();
  });
  return {
    data,
    update() {
      const width = canvas.clientWidth || 1;
      const height = canvas.clientHeight || 1;
      const radius = Math.max(1, Math.min(width, height) * 0.44);
      const cosine = Math.cos(state.rotation);
      const sine = Math.sin(state.rotation);
      const east = ((-state.offsetX * cosine - state.offsetY * sine) / radius) * state.range;
      const north = ((state.offsetX * sine - state.offsetY * cosine) / radius) * state.range;
      const center = shiftWaterCenter(location, east, north);
      const key = JSON.stringify([center, state.range]);
      if (!center || key === requestedView) return;
      requestedView = key;
      loader.load(center, state.range, (paths) => {
        data.paths = paths;
        redraw();
      });
    },
    destroy() {
      loader.cancel();
      control.destroy();
    },
  };
}
