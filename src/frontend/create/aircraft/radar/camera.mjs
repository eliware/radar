import { configureRadarViewDefaults } from "../../../configure-radar/view-defaults.mjs";

export function createAircraftRadarCamera({
  createCamera,
  cameraOptions,
  targets,
  defaultRangeNm,
  defaultRotationDegrees,
}) {
  let autoZoom = true;
  const radarCamera = createCamera({
    ...cameraOptions,
    onManualZoom: () => (autoZoom = false),
  });
  const reset = configureRadarViewDefaults(
    radarCamera,
    targets,
    (value) => (autoZoom = value),
    defaultRangeNm,
    defaultRotationDegrees,
  );
  return { radarCamera, reset, isAutoZoom: () => autoZoom };
}
