import { projectAircraftPosition } from "../aircraft/space-position.mjs";

const projectedCache = new WeakMap();
const MIN_POINT_DISTANCE_SQUARED = 0.36;

export function drawWaterOutlines(context, paths, project, location, width, height) {
  if (!Array.isArray(paths) || !location) return;
  const projected = getProjectedPaths(paths, location);
  context.save();
  context.strokeStyle = "rgba(125, 125, 125, 0.45)";
  context.lineWidth = 1;
  context.beginPath();
  let hasVisiblePath = false;
  for (const path of projected) {
    if (path.points.length < 4 || !intersectsView(path, project, width, height)) continue;
    drawPath(context, path.points, project);
    hasVisiblePath = true;
  }
  if (hasVisiblePath) context.stroke();
  context.restore();
}

function getProjectedPaths(paths, location) {
  let locations = projectedCache.get(paths);
  if (!locations) projectedCache.set(paths, (locations = new WeakMap()));
  let projected = locations.get(location);
  if (!projected) {
    projected = paths.map((path) => projectPath(path, location));
    locations.set(location, projected);
  }
  return projected;
}

function projectPath(path, location) {
  const points = [];
  const bounds = { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity };
  for (const point of path) {
    const position = projectAircraftPosition(point, location, 0);
    if (!position) continue;
    points.push(position.x, position.z);
    bounds.minX = Math.min(bounds.minX, position.x);
    bounds.maxX = Math.max(bounds.maxX, position.x);
    bounds.minZ = Math.min(bounds.minZ, position.z);
    bounds.maxZ = Math.max(bounds.maxZ, position.z);
  }
  return { points, bounds };
}

function intersectsView(path, project, width, height) {
  if (!Number.isFinite(width) || !Number.isFinite(height)) return true;
  const { minX, maxX, minZ, maxZ } = path.bounds;
  const corners = [
    project({ x: minX, z: minZ }),
    project({ x: minX, z: maxZ }),
    project({ x: maxX, z: minZ }),
    project({ x: maxX, z: maxZ }),
  ];
  let minScreenX = Infinity;
  let maxScreenX = -Infinity;
  let minScreenY = Infinity;
  let maxScreenY = -Infinity;
  for (const point of corners) {
    minScreenX = Math.min(minScreenX, point.x);
    maxScreenX = Math.max(maxScreenX, point.x);
    minScreenY = Math.min(minScreenY, point.y);
    maxScreenY = Math.max(maxScreenY, point.y);
  }
  return !(maxScreenX < 0 || minScreenX > width || maxScreenY < 0 || minScreenY > height);
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
