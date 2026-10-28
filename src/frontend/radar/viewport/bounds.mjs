import { MAX_RADAR_RANGE } from "../range.mjs";
import { getFrustumPlaneIntersections } from "./intersections.mjs";

export function getRadarViewportBounds(THREE, camera, width, height, groundY = 0) {
  if (!camera || width <= 0 || height <= 0) return emptyBounds();
  const points = getFrustumPlaneIntersections(THREE, camera, groundY);
  return points.length ? boundsFor(points) : emptyBounds();
}

function boundsFor(points) {
  const bounded = points.map(limitRadius);
  const minX = Math.min(...bounded.map((point) => point.x));
  const maxX = Math.max(...bounded.map((point) => point.x));
  const minZ = Math.min(...bounded.map((point) => point.z));
  const maxZ = Math.max(...bounded.map((point) => point.z));
  const nearestX = Math.max(minX, Math.min(0, maxX));
  const nearestZ = Math.max(minZ, Math.min(0, maxZ));
  const farthest = Math.max(...bounded.map(({ x, z }) => Math.hypot(x, z)));
  return {
    minX,
    maxX,
    minZ,
    maxZ,
    minRangeNm: Math.hypot(nearestX, nearestZ),
    maxRangeNm: farthest,
    visibleRadiusNm: farthest,
  };
}

function limitRadius(point) {
  const distance = Math.hypot(point.x, point.z);
  const scale = distance > MAX_RADAR_RANGE ? MAX_RADAR_RANGE / distance : 1;
  return { x: point.x * scale, z: point.z * scale };
}

function emptyBounds() {
  return {
    minX: 1,
    maxX: -1,
    minZ: 1,
    maxZ: -1,
    minRangeNm: MAX_RADAR_RANGE,
    maxRangeNm: 0,
    visibleRadiusNm: 0,
  };
}
