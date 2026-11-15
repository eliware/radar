import { configureRadarViewDefaults } from "../../../configure-radar/view-defaults.mjs";
import { createAircraftRadarAutoZoom } from "./auto-zoom.mjs";

export function createAircraftRadarCamera({
  createCamera,
  cameraOptions,
  targets,
  defaultRangeNm,
  defaultRotationDegrees,
}) {
  const autoZoom = createAircraftRadarAutoZoom();
  const radarCamera = createCamera({
    ...cameraOptions,
    onManualZoom: autoZoom.disable,
  });
  const reset = configureRadarViewDefaults(
    radarCamera,
    targets,
    autoZoom.setEnabled,
    defaultRangeNm,
    defaultRotationDegrees,
  );
  return { radarCamera, reset, isAutoZoom: autoZoom.isEnabled };
}
