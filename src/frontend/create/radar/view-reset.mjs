import { default as selectDefaultRadarRange } from "../../radar/default-range.mjs";

function createRadarViewReset(
  radarCamera,
  targets,
  setAutoZoom,
  defaultRangeNm,
  defaultRotationRadians,
) {
  return () => {
    setAutoZoom(true);
    radarCamera.setRange(selectDefaultRadarRange(targets.localDistances(), defaultRangeNm));
    radarCamera.setRotation(defaultRotationRadians);
  };
}
export default createRadarViewReset;
