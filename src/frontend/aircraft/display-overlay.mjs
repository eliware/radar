import { default as createAircraftOverlayCanvas } from "./overlay/canvas.mjs";
import { default as createOverlayDrawer } from "./overlay-draw.mjs";
import { default as attachAircraftOverlayLegendInteraction } from "./overlay/legend-interaction.mjs";

function createAircraftDisplayOverlay({ THREE, container, windowRef, documentRef }) {
  const { canvas, context } = createAircraftOverlayCanvas(container, documentRef);
  const detachLegendClick = attachAircraftOverlayLegendInteraction({
    container,
    documentRef,
    windowRef,
  });

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
export default createAircraftDisplayOverlay;
