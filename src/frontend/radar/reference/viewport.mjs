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
  const visibleRadiusNm = Math.max(...points.map(({ x, z }) => Math.hypot(x, z)));
  const nearestX = Math.max(bounds.minX, Math.min(0, bounds.maxX));
  const nearestZ = Math.max(bounds.minZ, Math.min(0, bounds.maxZ));
  return {
    ...bounds,
    visibleRadiusNm,
    minRangeNm: Math.max(0, Math.hypot(nearestX, nearestZ) - REFERENCE_MARGIN_NM),
    maxRangeNm: Math.min(300, visibleRadiusNm + REFERENCE_MARGIN_NM),
  };
}
