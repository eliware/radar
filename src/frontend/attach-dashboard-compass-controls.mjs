import { attachMobileCompassTracking } from "./attach-mobile-compass-tracking.mjs";
import { attachRadarArrowControls } from "./attach-radar-arrow-controls.mjs";
import { attachRadarCompassDisplay } from "./attach-radar-compass-display.mjs";
import { attachRadarResetControls } from "./attach-radar-reset-controls.mjs";

export function attachDashboardCompassControls(documentRef, windowRef, view) {
  return {
    detachCompass: attachRadarCompassDisplay(documentRef, view),
    detachMobileCompass: attachMobileCompassTracking(documentRef, windowRef, view),
    detachReset: attachRadarResetControls(documentRef, view),
    detachArrowControls: attachRadarArrowControls(documentRef, view),
  };
}
