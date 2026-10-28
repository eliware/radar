import { getProjectedWaterPaths, waterPathIntersectsView } from "./path-cache.mjs";
const MIN_POINT_DISTANCE_SQUARED = 0.36;

export function drawWaterOutlines(context, paths, project, location, width, height) {
  if (!Array.isArray(paths) || !location) return;
  const projected = getProjectedWaterPaths(paths, location);
  context.save();
  context.strokeStyle = "rgba(125, 125, 125, 0.45)";
  context.lineWidth = 1;
  context.beginPath();
  let hasVisiblePath = false;
  for (const path of projected) {
    if (path.points.length < 4 || !waterPathIntersectsView(path, project, width, height)) continue;
    drawPath(context, path.points, project);
    hasVisiblePath = true;
  }
  if (hasVisiblePath) context.stroke();
  context.restore();
}

function drawPath(context, coordinates, project) {
  let previous;
  for (let index = 0; index < coordinates.length; index += 2) {
    const point = project({ x: coordinates[index], z: coordinates[index + 1] });
    if (!previous) context.moveTo(point.x, point.y);
    else if (distanceSquared(previous, point) >= MIN_POINT_DISTANCE_SQUARED) {
      context.lineTo(point.x, point.y);
      previous = point;
    }
    if (!previous) previous = point;
  }
}

function distanceSquared(first, second) {
  return (first.x - second.x) ** 2 + (first.y - second.y) ** 2;
}
