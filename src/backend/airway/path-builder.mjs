import { distanceNauticalMiles } from "../../shared/distance-nautical-miles.mjs";

export function buildAirways(rows, location) {
  const groups = new Map();
  const cosine = Math.cos((location.latitude * Math.PI) / 180);
  for (const row of rows) {
    const key = `${row.name}:${row.location}:${row.regulatory}`;
    const point = pointAtHome(row, location, cosine);
    const group = groups.get(key) ?? { paths: [], current: null, previous: null };
    if (!point) flush(group);
    else if (!group.current || group.previous?.nextFix !== row.fix) {
      flush(group);
      group.current = {
        name: row.name,
        type: row.name[0],
        location: row.location,
        regulatory: row.regulatory,
        points: [point],
      };
    } else group.current.points.push(point);
    if (point) group.previous = row;
    if (point && !row.nextFix) flush(group);
    groups.set(key, group);
  }
  return [...groups.values()].flatMap((group) => (flush(group), group.paths));
}

function pointAtHome(row, location, cosine) {
  if (!Number.isFinite(row.latitude) || !Number.isFinite(row.longitude)) return null;
  const x = (row.longitude - location.longitude) * 60 * cosine;
  const z = -(row.latitude - location.latitude) * 60;
  return {
    fix: row.fix,
    latitude: row.latitude,
    longitude: row.longitude,
    x,
    z,
    rangeNm: distanceNauticalMiles(location, row),
  };
}

function flush(group) {
  if (group.current?.points.length) {
    const index = group.paths.length;
    group.current.id = `${group.current.name}:${group.current.location}:${group.current.regulatory}:${index}`;
    group.paths.push(group.current);
  }
  group.current = null;
  group.previous = null;
}
