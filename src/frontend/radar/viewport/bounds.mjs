import { MAX_RADAR_RANGE } from "../range.mjs";

const FEET_PER_NM = 6076.12;
const LEVELS_FEET = [0, 4000, 10000, 18000];
const EDGES = [
  [0, 1],
  [1, 3],
  [3, 2],
  [2, 0],
  [4, 5],
  [5, 7],
  [7, 6],
  [6, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

export function getRadarViewportBounds(THREE, camera, width, height, groundY = 0) {
  if (!camera || width <= 0 || height <= 0) return emptyBounds();
  camera.updateMatrixWorld();
  const corners = frustumCorners(THREE, camera);
  const points = [];
  for (const feet of LEVELS_FEET) {
    const planeY = groundY + feet / FEET_PER_NM;
    for (const [from, to] of EDGES)
      addPlaneIntersection(corners[from], corners[to], planeY, points);
  }
  return points.length ? boundsFor(points) : emptyBounds();
}

export function createRadarViewportBounds(THREE, camera, container, elevationFeet) {
  return () =>
    getRadarViewportBounds(
      THREE,
      camera,
      container.clientWidth,
      container.clientHeight,
      -elevationFeet / FEET_PER_NM,
    );
}

function frustumCorners(THREE, camera) {
  const corners = [];
  for (const depth of [-1, 1])
    for (const y of [-1, 1])
      for (const x of [-1, 1]) corners.push(new THREE.Vector3(x, y, depth).unproject(camera));
  return corners;
}

function addPlaneIntersection(from, to, y, points) {
  const delta = to.y - from.y;
  if (delta === 0) return;
  const amount = (y - from.y) / delta;
  if (amount < 0 || amount > 1) return;
  points.push({ x: from.x + amount * (to.x - from.x), z: from.z + amount * (to.z - from.z) });
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
