import { attachRadarLegendClick } from "../attach/radar-legend-click.mjs";
import { createOverlayDrawer } from "./overlay-draw.mjs";

export function createAircraftDisplayOverlay({ THREE, container, windowRef, documentRef }) {
  const canvas = documentRef.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is unavailable in this browser.");
  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    zIndex: "1",
    pointerEvents: "none",
  });
  container.appendChild(canvas);
  const detachLegendClick = attachRadarLegendClick(container, documentRef, windowRef);

  const draw = createOverlayDrawer({ THREE, container, windowRef, canvas, context });
  return {
    canvas,
    draw,
    destroy: () => {
      detachLegendClick();
      canvas.remove();
    },
  };
}
