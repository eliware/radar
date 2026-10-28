import { createRadarFallback } from "./fallback.mjs";
import { notifyRadarViewMode } from "./mode-notifier.mjs";
import { loadAircraftScene } from "./scene-loader.mjs";

export async function createRadarView({
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
