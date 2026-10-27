export function pathInRange(points, minRangeNm, maxRangeNm) {
  if (points.length === 1)
    return points[0].rangeNm >= minRangeNm && points[0].rangeNm <= maxRangeNm;
  return points.slice(1).some((to, index) => {
    const from = points[index];
    const dx = to.x - from.x;
    const dz = to.z - from.z;
    const t = Math.max(0, Math.min(1, -(from.x * dx + from.z * dz) / (dx * dx + dz * dz || 1)));
    const closest = Math.hypot(from.x + t * dx, from.z + t * dz);
    return closest <= maxRangeNm && Math.max(from.rangeNm, to.rangeNm) >= minRangeNm;
  });
}
