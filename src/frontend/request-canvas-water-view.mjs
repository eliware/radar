import { calculateCanvasWaterView } from "./water/canvas-view.mjs";

export function createCanvasWaterViewRequester(location, canvas, state, loader, data, redraw) {
  let requestedView = "";
  return {
    update() {
      const { center, key } = calculateCanvasWaterView(location, canvas, state);
      if (!center || key === requestedView) return;
      requestedView = key;
      loader.load(center, state.range, (paths, successful) => {
        if (!successful) requestedView = "";
        data.paths = paths;
        redraw();
      });
    },
  };
}
