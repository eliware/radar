import { default as createRadarViewReset } from "../create/radar/view-reset.mjs";

function configureRadarViewDefaults(
  radarCamera,
  targets,
  setAutoZoom,
  defaultRangeNm,
  defaultRotationDegrees,
) {
  const defaultRotationRadians = (defaultRotationDegrees * Math.PI) / 180;
  radarCamera.setRange(defaultRangeNm);
  radarCamera.setRotation(defaultRotationRadians);
  return createRadarViewReset(
    radarCamera,
    targets,
    setAutoZoom,
    defaultRangeNm,
    defaultRotationRadians,
  );
}
export default configureRadarViewDefaults;
