import { projectAircraftPosition } from "./aircraft-space-position.mjs";
import { drawCanvasRadar } from "./draw-canvas-radar.mjs";
import { attachCanvasPan } from "./canvas-radar-pan.mjs";
import { attachMobileRadarGestures } from "./mobile-radar-gestures.mjs";

export function createCanvasRadarView({
  container,
  location,
  windowRef = window,
  documentRef = document,
}) {
  const canvas = documentRef.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is unavailable in this browser.");
  const aircraft = new Map();
  let range = 60;
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
      aircraft,
      location,
      range,
      offsetX,
      offsetY,
      windowRef,
      rotation,
    );
  const resize = () => draw();
  const detachGestures = attachMobileRadarGestures(canvas, {
    onZoom: (factor) => {
      range = clampRange(range * factor);
      draw();
    },
    onRotate: (angle) => {
      rotation += angle;
      draw();
    },
  });
  const detachPan = attachCanvasPan(canvas, (x, y) => {
    offsetX += x;
    offsetY += y;
    draw();
  });
  const onWheel = (event) => {
    event.preventDefault();
    range = clampRange(range * (event.deltaY > 0 ? 1.2 : 1 / 1.2));
    draw();
  };
  canvas.addEventListener("wheel", onWheel, { passive: false });
  windowRef.addEventListener("resize", resize);
  draw();
  return {
    mode: "2D",
    update(item) {
      if (!projectAircraftPosition(item, location, 0)) return;
      aircraft.set(item.icao, item);
      draw();
    },
    reset() {
      range = 60;
      offsetX = 0;
      offsetY = 0;
      rotation = 0;
      draw();
    },
    destroy() {
      windowRef.removeEventListener("resize", resize);
      detachGestures();
      detachPan();
      canvas.removeEventListener("wheel", onWheel);
      container.replaceChildren();
    },
  };
}

const clampRange = (range) => Math.max(1, Math.min(300, range));
