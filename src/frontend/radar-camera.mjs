import {
  DEFAULT_RADAR_RANGE,
  MAX_RADAR_RANGE,
  MIN_RADAR_RANGE,
  clampRadarRange,
} from "./radar-range.mjs";
import { cameraDistanceToRange, rangeToCameraDistance } from "./radar-camera-range.mjs";
import { configureMobileRadarControls } from "./mobile-radar-gestures.mjs";

export function createRadarCamera({
  camera,
  controls,
  element,
  windowRef,
  onManualZoom,
  onRangeChange,
  defaultRangeNm = DEFAULT_RADAR_RANGE,
}) {
  let range = defaultRangeNm;
  controls.minDistance = rangeToCameraDistance(MIN_RADAR_RANGE);
  controls.maxDistance = rangeToCameraDistance(MAX_RADAR_RANGE);
  const onStart = () => onManualZoom();
  const onChange = () => {
    const distance = distanceFromTarget(camera.position, controls.target);
    if (distance === null) return;
    range = cameraDistanceToRange(distance);
    onRangeChange(range);
  };
  controls.addEventListener("start", onStart);
  controls.addEventListener("change", onChange);
  const setRange = (value) => {
    range = clampRadarRange(value);
    camera.position.set(0, rangeToCameraDistance(range), 0);
    controls.target.set(0, 0, 0);
    controls.update();
    onRangeChange(range);
  };
  const setRotation = (radians) => {
    const current = controls.getAzimuthalAngle?.() ?? 0;
    controls.rotateLeft(-(radians - current));
    controls.update();
  };
  const zoomBy = (factor) => {
    onManualZoom();
    const distance = distanceFromTarget(camera.position, controls.target);
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
  };
  const detachGestures = configureMobileRadarControls(controls, element, windowRef, zoomBy);
  return {
    setRange,
    setRotation,
    zoomBy,
    range: () => range,
    dispose() {
      controls.removeEventListener("start", onStart);
      controls.removeEventListener("change", onChange);
      detachGestures();
    },
  };
}

function distanceFromTarget(position, target) {
  const values = [position.x - target.x, position.y - target.y, position.z - target.z];
  if (values.some((value) => !Number.isFinite(value))) return null;
  return Math.hypot(...values);
}
