import {
  DEFAULT_RADAR_RANGE,
  MAX_RADAR_RANGE,
  MIN_RADAR_RANGE,
  cameraDistanceToRange,
  clampRadarRange,
  rangeToCameraDistance,
} from "./radar-range.mjs";
import { configureMobileRadarControls } from "./mobile-radar-gestures.mjs";

export function createRadarCamera({
  camera,
  controls,
  scene,
  element,
  windowRef,
  onManualZoom,
  onRangeChange,
}) {
  let range = DEFAULT_RADAR_RANGE;
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
  const zoomBy = (factor) => {
    onManualZoom();
    setRange(range * factor);
  };
  const detachGestures = configureMobileRadarControls(controls, scene, element, windowRef, zoomBy);
  return {
    setRange,
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
