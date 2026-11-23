import { default as createRadarFallback } from "./fallback.mjs";
import { default as notifyRadarViewMode } from "./mode-notifier.mjs";
import { default as loadAircraftScene } from "./scene-loader.mjs";

async function createRadarView({
  container,
  location,
  elevationFeet,
  defaultRangeNm,
  defaultRotationDegrees,
  windowRef = window,
  onMode,
}) {
  try {
    const view = await loadAircraftScene({
      container,
      location,
      elevationFeet,
      defaultRangeNm,
      defaultRotationDegrees,
      windowRef,
    });
    notifyRadarViewMode(onMode, "3D");
    return view;
  } catch (error) {
    const view = createRadarFallback(error, {
      container,
      location,
      elevationFeet,
      defaultRangeNm,
      defaultRotationDegrees,
      windowRef,
    });
    notifyRadarViewMode(onMode, "2D");
    return view;
  }
}
export default createRadarView;
