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
