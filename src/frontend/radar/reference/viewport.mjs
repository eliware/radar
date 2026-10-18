export const REFERENCE_MARGIN_NM = 35;

export function createRadarViewport(width, height, range, panX, panY, rotation) {
  const radius = Math.max(1, Math.min(width, height) * 0.44);
  const cosine = Math.cos(rotation);
  const sine = Math.sin(rotation);
  const points = [
    [-width / 2 - panX, -height / 2 - panY],
    [width / 2 - panX, -height / 2 - panY],
    [-width / 2 - panX, height / 2 - panY],
    [width / 2 - panX, height / 2 - panY],
  ].map(([dx, dy]) => ({
    x: ((dx * cosine + dy * sine) * range) / radius,
    z: ((-dx * sine + dy * cosine) * range) / radius,
  }));
  const bounds = points.reduce(
    (result, point) => ({
      minX: Math.min(result.minX, point.x),
      maxX: Math.max(result.maxX, point.x),
      minZ: Math.min(result.minZ, point.z),
      maxZ: Math.max(result.maxZ, point.z),
    }),
    { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity },
  );
  const nearestX = Math.max(bounds.minX, Math.min(0, bounds.maxX));
  const nearestZ = Math.max(bounds.minZ, Math.min(0, bounds.maxZ));
  return {
    ...bounds,
    minRangeNm: Math.max(0, Math.hypot(nearestX, nearestZ) - REFERENCE_MARGIN_NM),
    maxRangeNm: Math.min(
      300,
      Math.max(...points.map(({ x, z }) => Math.hypot(x, z))) + REFERENCE_MARGIN_NM,
    ),
  };
}

export function intersectsViewport(item, bounds, location, padding = 0) {
  const box = expand(bounds, padding);
  const points = item.points?.map((point) => localPoint(point, location)).filter(Boolean) ?? [];
  if (points.length)
    return (
      points.some((point) => inside(point, box)) ||
      points.slice(1).some((point, index) => segmentIntersects(points[index], point, box))
    );
  const point = localPoint(item, location);
  return point ? inside(point, box) : false;
}

function localPoint(point, location) {
  if (Number.isFinite(point?.x) && Number.isFinite(point?.z)) return point;
  if (!location || !Number.isFinite(point?.latitude) || !Number.isFinite(point?.longitude))
    return null;
  return {
    x: (point.longitude - location.longitude) * 60 * Math.cos((location.latitude * Math.PI) / 180),
    z: -(point.latitude - location.latitude) * 60,
  };
}

function expand(box, padding) {
  return {
    minX: box.minX - padding,
    maxX: box.maxX + padding,
    minZ: box.minZ - padding,
    maxZ: box.maxZ + padding,
  };
}

function inside(point, box) {
  return point.x >= box.minX && point.x <= box.maxX && point.z >= box.minZ && point.z <= box.maxZ;
}

function segmentIntersects(from, to, box) {
  let low = 0;
  let high = 1;
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  for (const [p, q] of [
    [-dx, from.x - box.minX],
    [dx, box.maxX - from.x],
    [-dz, from.z - box.minZ],
    [dz, box.maxZ - from.z],
  ]) {
    if (p === 0 && q < 0) return false;
    if (p === 0) continue;
    const t = q / p;
    if (p < 0) low = Math.max(low, t);
    else high = Math.min(high, t);
    if (low > high) return false;
  }
  return true;
}
