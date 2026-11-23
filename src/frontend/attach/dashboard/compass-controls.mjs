import { default as attachMobileCompassTracking } from "../mobile/compass-tracking.mjs";
import { default as attachRadarArrowControls } from "../radar/arrow-controls.mjs";
import { default as attachRadarCompassDisplay } from "../radar/compass-display.mjs";
import { default as attachRadarResetControls } from "../radar/reset-controls.mjs";

function attachDashboardCompassControls(documentRef, windowRef, view) {
  return {
    detachCompass: attachRadarCompassDisplay(documentRef, view),
    detachMobileCompass: attachMobileCompassTracking(documentRef, windowRef, view),
    detachReset: attachRadarResetControls(documentRef, view),
    detachArrowControls: attachRadarArrowControls(documentRef, view),
  };
}
export default attachDashboardCompassControls;
