import { attachCanvasPan } from "./canvas-radar-pan.mjs";
import { attachMobileRadarGestures } from "./mobile-radar-gestures.mjs";
import { attachCanvasRefresh } from "./attach-canvas-refresh.mjs";
import { watchRadarTargets } from "./watch-radar-targets.mjs";
import { createCanvasRadarGestures } from "./create-canvas-radar-gestures.mjs";
import { clampRadarRange, selectDefaultRadarRange } from "./radar-range.mjs";

export function attachCanvasRadarEvents(canvas, state, draw, targets, trails, windowRef) {
  const gestures = attachMobileRadarGestures(canvas, createCanvasRadarGestures(state, draw));
  const pan = attachCanvasPan(canvas, (x, y) => {
    state.autoZoom = false;
    state.offsetX += x;
    state.offsetY += y;
    draw();
  });
  const watch = watchRadarTargets({
    targets,
    windowRef,
    onExpire: (expired) => {
      trails.remove(expired);
      if (state.autoZoom) state.range = selectDefaultRadarRange(targets.distances());
      draw();
    },
  });
  const refresh = attachCanvasRefresh(canvas, windowRef, draw, (event) => {
    state.autoZoom = false;
    state.range = clampRadarRange(state.range * (event.deltaY > 0 ? 1.2 : 1 / 1.2));
  });
  return () => [refresh, watch, gestures, pan].forEach((detach) => detach());
}
