export function createRadarScopePath(range, project) {
  return Array.from({ length: 64 }, (_, index) => {
    const angle = (index * Math.PI * 2) / 64;
    return project({ x: Math.cos(angle) * range, y: 0, z: Math.sin(angle) * range });
  });
}
