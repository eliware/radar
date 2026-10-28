export function groupBoundaries(rows) {
  const boundaries = new Map();
  for (const row of rows) {
    const id = `${row.locationId}:${row.altitude}:${row.type}`;
    const boundary = boundaries.get(id) ?? {
      locationId: row.locationId,
      name: row.name,
      altitude: row.altitude,
      type: row.type,
      points: [],
    };
    boundary.points.push({
      sequence: row.sequence,
      latitude: row.latitude,
      longitude: row.longitude,
    });
    boundaries.set(id, boundary);
  }
  return boundaries;
}

export function intersectsRange(points, location, minRangeNm, maxRangeNm) {
  const projected = points.map((point) => toLocal(point, location));
  if (projected.length === 1) {
    const distance = Math.hypot(projected[0].x, projected[0].y);
    return distance >= minRangeNm && distance <= maxRangeNm;
  }
  for (let index = 1; index < projected.length; index++) {
    if (segmentIntersectsRange(projected[index - 1], projected[index], minRangeNm, maxRangeNm)) {
      return true;
    }
  }
  return false;
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
