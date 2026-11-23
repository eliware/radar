import { default as attachRadarLegendClick } from "../../attach/radar-legend/click.mjs";

function attachAircraftOverlayLegendInteraction({ container, documentRef, windowRef }) {
  return attachRadarLegendClick(container, documentRef, windowRef);
}
export default attachAircraftOverlayLegendInteraction;
