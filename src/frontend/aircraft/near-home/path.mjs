const FEET_PER_NAUTICAL_MILE = 6076.12;
const MAX_DISTANCE_NM = 1;
const MAX_AGL_NM = 2000 / FEET_PER_NAUTICAL_MILE;

export function isPredictedAircraftPathNearHome(start, end) {
  let minT = 0;
  let maxT = 1;
  if (start.y > MAX_AGL_NM && end.y > MAX_AGL_NM) return false;
  if (start.y <= MAX_AGL_NM !== end.y <= MAX_AGL_NM) {
    const crossing = (MAX_AGL_NM - start.y) / (end.y - start.y);
    if (start.y > MAX_AGL_NM) minT = crossing;
    else maxT = crossing;
  }

  const dx = end.x - start.x;
  const dz = end.z - start.z;
  const horizontalLengthSquared = dx * dx + dz * dz;
  const closestT = horizontalLengthSquared
    ? Math.max(minT, Math.min(maxT, -(start.x * dx + start.z * dz) / horizontalLengthSquared))
    : minT;
  const x = start.x + closestT * dx;
  const z = start.z + closestT * dz;
  return x * x + z * z <= MAX_DISTANCE_NM ** 2;
}
