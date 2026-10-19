import { selectDefaultRadarRange } from "../../radar/range.mjs";

export function createRadarViewReset(
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
