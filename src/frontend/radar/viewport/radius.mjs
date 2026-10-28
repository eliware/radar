import { MAX_RADAR_RANGE } from "../range.mjs";
import { cameraDistanceToRange } from "../distance-to-range.mjs";
import { createRadarViewportBounds } from "./bounds.mjs";

export function createRadarViewport(THREE, camera, controls, container, elevationFeet) {
  return {
    getViewportBounds: createRadarViewportBounds(THREE, camera, container, elevationFeet),
    visibleRadiusNm: createRadarViewportRadius(camera, controls, container),
  };
}

export function getRadarViewportRadius(camera, target, width, height) {
  if (!camera || !target || width <= 0 || height <= 0) return 1;
  const distance = camera.position.distanceTo(target);
  const aspect = width / height;
  const halfFov = (camera.fov * Math.PI) / 360;
  const radius = distance * Math.tan(halfFov) * Math.hypot(1, aspect);
  return Math.min(MAX_RADAR_RANGE, Math.max(1, cameraDistanceToRange(distance), radius));
}

export function createRadarViewportRadius(camera, controls, container) {
  return () =>
    getRadarViewportRadius(camera, controls.target, container.clientWidth, container.clientHeight);
}
