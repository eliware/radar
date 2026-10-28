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
