export const FEET_PER_NM = 6076.12;

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

export function getFrustumPlaneIntersections(THREE, camera, groundY = 0) {
  camera.updateMatrixWorld();
  const corners = [];
  for (const depth of [-1, 1])
    for (const y of [-1, 1])
      for (const x of [-1, 1]) corners.push(new THREE.Vector3(x, y, depth).unproject(camera));
  const points = [];
  for (const feet of LEVELS_FEET) {
    const planeY = groundY + feet / FEET_PER_NM;
    for (const [from, to] of EDGES)
      addPlaneIntersection(corners[from], corners[to], planeY, points);
  }
  return points;
}

function addPlaneIntersection(from, to, y, points) {
  const delta = to.y - from.y;
  if (delta === 0) return;
  const amount = (y - from.y) / delta;
  if (amount < 0 || amount > 1) return;
  points.push({ x: from.x + amount * (to.x - from.x), z: from.z + amount * (to.z - from.z) });
}
