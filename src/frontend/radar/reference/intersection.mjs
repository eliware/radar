import { clipPolylineToViewport } from "./clip-polyline.mjs";

export function selectVisibleReferenceItems(items, bounds, location, padding = 0) {
  return items.flatMap((item) => {
    if (item.points?.length > 1) return clipPolylineToViewport(item, bounds, location);
    return intersectsViewport(item, bounds, location, padding) ? [item] : [];
  });
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
