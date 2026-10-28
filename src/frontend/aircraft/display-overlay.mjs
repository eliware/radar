import { attachRadarLegendClick } from "../attach/radar-legend-click.mjs";
import { createAircraftOverlayCanvas } from "./overlay/canvas.mjs";
import { createOverlayDrawer } from "./overlay-draw.mjs";

export function createAircraftDisplayOverlay({ THREE, container, windowRef, documentRef }) {
  const { canvas, context } = createAircraftOverlayCanvas(container, documentRef);
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
