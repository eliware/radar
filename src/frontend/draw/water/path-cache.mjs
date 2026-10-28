import { projectAircraftPosition } from "../../aircraft/space-position.mjs";

const projectedCache = new WeakMap();

export function getProjectedWaterPaths(paths, location) {
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
