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

export function waterPathIntersectsView(path, project, width, height) {
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
