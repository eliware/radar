import { default as configureRadarViewDefaults } from "../../../configure-radar/view-defaults.mjs";
import { default as createAircraftRadarAutoZoom } from "./auto-zoom.mjs";

function createAircraftRadarCamera({
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
export default createAircraftRadarCamera;
