import { projectAircraftPosition } from "./aircraft-space-position.mjs";
import { drawCanvasRadar } from "./draw-canvas-radar.mjs";
import { attachCanvasPan } from "./canvas-radar-pan.mjs";
import { attachMobileRadarGestures } from "./mobile-radar-gestures.mjs";
import { DEFAULT_RADAR_RANGE, clampRadarRange, selectDefaultRadarRange } from "./radar-range.mjs";
import { createRadarTargets } from "./radar-targets.mjs";
import { watchRadarTargets } from "./watch-radar-targets.mjs";
import { createAircraftTrails } from "./aircraft-trails.mjs";
import { attachCanvasRefresh } from "./attach-canvas-refresh.mjs";
export function createCanvasRadarView({
  container,
  location,
  windowRef = window,
  documentRef = document,
}) {
  const canvas = documentRef.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is unavailable in this browser.");
  const targets = createRadarTargets();
  const trails = createAircraftTrails();
  let range = DEFAULT_RADAR_RANGE;
  let autoZoom = true;
  let offsetX = 0;
  let offsetY = 0;
  let rotation = 0;
  canvas.setAttribute("aria-label", "Top-down 2D radar view");
  canvas.style.touchAction = "none";
  container.replaceChildren(canvas);
  const draw = () =>
    drawCanvasRadar(
      context,
      canvas,
      targets.items(),
      location,
      range,
      offsetX,
      offsetY,
      windowRef,
      rotation,
      trails,
    );
  const detachGestures = attachMobileRadarGestures(canvas, {
    onZoom: (factor) => {
      autoZoom = false;
      range = clampRadarRange(range * factor);
      draw();
    },
    onRotate: (angle) => {
      rotation += angle;
      draw();
    },
  });
  const detachPan = attachCanvasPan(canvas, (x, y) => {
    autoZoom = false;
    offsetX += x;
    offsetY += y;
    draw();
  });
  const stopTargetWatch = watchRadarTargets({
    targets,
    windowRef,
    onExpire: (expired) => {
      trails.remove(expired);
      if (autoZoom) range = selectDefaultRadarRange(targets.distances());
      draw();
    },
  });
  const detachRefresh = attachCanvasRefresh(canvas, windowRef, draw, (event) => {
    autoZoom = false;
    range = clampRadarRange(range * (event.deltaY > 0 ? 1.2 : 1 / 1.2));
  });
  draw();
  return {
    mode: "2D",
    update(item) {
      const position = projectAircraftPosition(item, location, 0);
      if (!position) return;
      const expired = targets.update(item, Math.hypot(position.x, position.z));
      trails.remove(expired);
      trails.add(item.icao, position);
      if (autoZoom) range = selectDefaultRadarRange(targets.distances());
      draw();
    },
    reset() {
      autoZoom = true;
      range = selectDefaultRadarRange(targets.distances());
      offsetX = 0;
      offsetY = 0;
      rotation = 0;
      draw();
    },
    destroy() {
      detachRefresh();
      stopTargetWatch();
      detachGestures();
      detachPan();
      container.replaceChildren();
    },
  };
}
