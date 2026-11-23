import { DEFAULT_RADAR_RANGE, MAX_RADAR_RANGE, MIN_RADAR_RANGE } from "../range.mjs";
import { default as clampRadarRange } from "../clamp-range.mjs";
import { default as cameraDistanceToRange } from "../distance-to-range.mjs";
import { default as rangeToCameraDistance } from "../range-to-distance.mjs";

function createRadarCameraState({
  camera,
  controls,
  onManualZoom,
  onRangeChange,
  defaultRangeNm = DEFAULT_RADAR_RANGE,
}) {
  let range = defaultRangeNm;
  controls.minDistance = rangeToCameraDistance(MIN_RADAR_RANGE);
  controls.maxDistance = rangeToCameraDistance(MAX_RADAR_RANGE);

  function distanceFromTarget() {
    const values = [
      camera.position.x - controls.target.x,
      camera.position.y - controls.target.y,
      camera.position.z - controls.target.z,
    ];
    if (values.some((value) => !Number.isFinite(value))) return null;
    return Math.hypot(...values);
  }

  function setAzimuth(radians) {
    const current = controls.getAzimuthalAngle?.() ?? 0;
    controls.rotateLeft(-(radians - current));
    controls.update();
  }

  function setRange(value) {
    const rotation = controls.getAzimuthalAngle?.() ?? 0;
    range = clampRadarRange(value);
    camera.position.set(0, rangeToCameraDistance(range), 0);
    controls.target.set(0, 0, 0);
    controls.update();
    setAzimuth(rotation);
    onRangeChange(range);
  }

  function zoomBy(factor) {
    onManualZoom();
    const distance = distanceFromTarget();
    range = clampRadarRange(range * factor);
    if (distance === null || distance === 0) return setRange(range);
    const scale = rangeToCameraDistance(range) / distance;
    camera.position.set(
      controls.target.x + (camera.position.x - controls.target.x) * scale,
      controls.target.y + (camera.position.y - controls.target.y) * scale,
      controls.target.z + (camera.position.z - controls.target.z) * scale,
    );
    controls.update();
    onRangeChange(range);
  }

  return {
    setRange,
    setRotation: (headingRadians) => setAzimuth(-headingRadians),
    zoomBy,
    range: () => range,
    updateRangeFromCamera() {
      const distance = distanceFromTarget();
      if (distance === null) return;
      range = cameraDistanceToRange(distance);
      onRangeChange(range);
    },
  };
}
export default createRadarCameraState;
