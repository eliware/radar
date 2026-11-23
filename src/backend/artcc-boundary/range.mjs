function createArtccBoundaryRangeFilter(points, location) {
  const projected = points.map((point) => toLocal(point, location));
  if (!projected.length) return () => false;
  const bounds = projected.reduce(
    (result, point) => ({
      minX: Math.min(result.minX, point.x),
      maxX: Math.max(result.maxX, point.x),
      minY: Math.min(result.minY, point.y),
      maxY: Math.max(result.maxY, point.y),
    }),
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
  );

  return (minRangeNm, maxRangeNm) => {
    const nearestX = Math.max(bounds.minX, 0, -bounds.maxX);
    const nearestY = Math.max(bounds.minY, 0, -bounds.maxY);
    if (Math.hypot(nearestX, nearestY) > maxRangeNm) return false;
    const farthest = Math.max(
      Math.hypot(bounds.minX, bounds.minY),
      Math.hypot(bounds.minX, bounds.maxY),
      Math.hypot(bounds.maxX, bounds.minY),
      Math.hypot(bounds.maxX, bounds.maxY),
    );
    if (farthest < minRangeNm) return false;
    if (projected.length === 1) {
      const distance = Math.hypot(projected[0].x, projected[0].y);
      return distance >= minRangeNm && distance <= maxRangeNm;
    }
    for (let index = 1; index < projected.length; index += 1) {
      if (segmentIntersectsRange(projected[index - 1], projected[index], minRangeNm, maxRangeNm)) {
        return true;
      }
    }
    return false;
  };
}

function toLocal(point, origin) {
  return {
    x: (point.longitude - origin.longitude) * 60 * Math.cos((origin.latitude * Math.PI) / 180),
    y: (point.latitude - origin.latitude) * 60,
  };
}

function segmentIntersectsRange(start, end, minRangeNm, maxRangeNm) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  const ratio = lengthSquared
    ? Math.max(0, Math.min(1, -(start.x * dx + start.y * dy) / lengthSquared))
    : 0;
  const nearest = Math.hypot(start.x + ratio * dx, start.y + ratio * dy);
  const farthest = Math.max(Math.hypot(start.x, start.y), Math.hypot(end.x, end.y));
  return nearest <= maxRangeNm && farthest >= minRangeNm;
}
export default createArtccBoundaryRangeFilter;
