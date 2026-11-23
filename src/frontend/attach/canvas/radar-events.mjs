import { default as attachCanvasPan } from "../../canvas-radar/pan.mjs";
import { default as attachMobileRadarGestures } from "../mobile/radar-gestures.mjs";
import { default as attachCanvasRefresh } from "./refresh.mjs";
import { default as watchRadarTargets } from "../../watch-radar-targets.mjs";
import { default as createCanvasRadarGestures } from "../../create/canvas/radar/gestures.mjs";
import { default as clampRadarRange } from "../../radar/clamp-range.mjs";
import { default as selectDefaultRadarRange } from "../../radar/default-range.mjs";
import { default as attachRadarLegendClick } from "../radar-legend/click.mjs";
import { default as attachRadarLegendRedraw } from "../radar-legend/redraw.mjs";

function attachCanvasRadarEvents(
  canvas,
  state,
  draw,
  targets,
  trails,
  windowRef,
  legendTopInset = 0,
  receiveTimes,
) {
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
    onTick: draw,
    onExpire: (expired) => {
      trails.remove(expired);
      receiveTimes?.remove(expired);
      if (state.autoZoom)
        state.range = selectDefaultRadarRange(targets.localDistances(), state.defaultRangeNm);
      draw();
    },
  });
  const refresh = attachCanvasRefresh(canvas, windowRef, draw, (event) => {
    state.autoZoom = false;
    state.range = clampRadarRange(state.range * (event.deltaY > 0 ? 1.2 : 1 / 1.2));
  });
  const legend = attachRadarLegendClick(
    canvas,
    windowRef.document ?? globalThis.document,
    windowRef,
    legendTopInset,
  );
  const legendRedraw = attachRadarLegendRedraw(windowRef.document ?? globalThis.document, draw);
  return () => [refresh, watch, gestures, pan, legend, legendRedraw].forEach((detach) => detach());
}
export default attachCanvasRadarEvents;
