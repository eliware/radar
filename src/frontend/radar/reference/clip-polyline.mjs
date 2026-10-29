import { createClippedPointOperations } from "./clipped-point.mjs";

const { interpolate, same } = createClippedPointOperations();

export function clipPolylineToViewport(item, bounds, location) {
  const points = item.points;
  if (!Array.isArray(points) || !points.length) return [];
  if (points.length === 1) return inside(localPoint(points[0], location), bounds) ? [item] : [];
  const runs = [];
  let run = [];
  const finish = () => {
    if (run.length > 1) runs.push(run);
    run = [];
  };
  for (let index = 1; index < points.length; index += 1) {
    const from = points[index - 1];
    const to = points[index];
    const a = localPoint(from, location);
    const b = localPoint(to, location);
    const interval = [a, b].every((point) => Number.isFinite(point.x) && Number.isFinite(point.z))
      ? clipSegment(a, b, bounds)
      : null;
    if (!interval) {
      finish();
      continue;
    }
    const start = interpolate(from, to, interval[0]);
    const end = interpolate(from, to, interval[1]);
    if (!run.length || interval[0] > 0 || !same(localPoint(run.at(-1), location), a)) {
      finish();
      run = [start];
    }
    if (!same(localPoint(run.at(-1), location), localPoint(end, location))) run.push(end);
    if (interval[1] < 1) finish();
  }
  finish();
  return runs.map((visiblePoints, index) => ({
    ...item,
    id: runs.length === 1 ? item.id : `${item.id}:visible:${index}`,
    points: visiblePoints,
  }));
}

function clipSegment(a, b, box) {
  let start = 0;
  let end = 1;
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  for (const [p, q] of [
    [-dx, a.x - box.minX],
    [dx, box.maxX - a.x],
    [-dz, a.z - box.minZ],
    [dz, box.maxZ - a.z],
  ]) {
    if (p === 0 && q < 0) return null;
    if (p === 0) continue;
    const t = q / p;
    if (p < 0) start = Math.max(start, t);
    else end = Math.min(end, t);
    if (start > end) return null;
  }
  return [start, end];
}

function localPoint(point, location) {
  if (Number.isFinite(point?.x) && Number.isFinite(point?.z)) return point;
  return {
    x: (point.longitude - location.longitude) * 60 * Math.cos((location.latitude * Math.PI) / 180),
    z: -(point.latitude - location.latitude) * 60,
  };
}

function inside(point, box) {
  return point.x >= box.minX && point.x <= box.maxX && point.z >= box.minZ && point.z <= box.maxZ;
}
