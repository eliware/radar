import { attachRadarLegendClick } from "../../attach/radar-legend/click.mjs";

export function attachAircraftOverlayLegendInteraction({ container, documentRef, windowRef }) {
  return attachRadarLegendClick(container, documentRef, windowRef);
}
