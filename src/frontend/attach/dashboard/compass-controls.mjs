import { attachMobileCompassTracking } from "../mobile/compass-tracking.mjs";
import { attachRadarArrowControls } from "../radar/arrow-controls.mjs";
import { attachRadarCompassDisplay } from "../radar/compass-display.mjs";
import { attachRadarResetControls } from "../radar/reset-controls.mjs";

export function attachDashboardCompassControls(documentRef, windowRef, view) {
  return {
    detachCompass: attachRadarCompassDisplay(documentRef, view),
    detachMobileCompass: attachMobileCompassTracking(documentRef, windowRef, view),
    detachReset: attachRadarResetControls(documentRef, view),
    detachArrowControls: attachRadarArrowControls(documentRef, view),
  };
}
