import { distanceNauticalMiles } from "../shared/distance-nautical-miles.mjs";
import { AIRWAY_QUERY } from "./airway-query-rules.mjs";

export function createAirwayQuery(database) {
  const statement = database.prepare(AIRWAY_QUERY);
  let rows;
  return (location, minRangeNm, maxRangeNm) => {
    rows ??= statement.all();
    return buildAirways(rows, location, minRangeNm, maxRangeNm);
  };
}

function buildAirways(rows, location, minRangeNm, maxRangeNm) {
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
  const paths = [...groups.values()].flatMap((group) => (flush(group), group.paths));
  return paths.filter((path) => pathInRange(path.points, minRangeNm, maxRangeNm));
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

function pathInRange(points, minRangeNm, maxRangeNm) {
  if (points.length === 1) return inBand(points[0].rangeNm, minRangeNm, maxRangeNm);
  return points.slice(1).some((to, index) => {
    const from = points[index];
    const dx = to.x - from.x;
    const dz = to.z - from.z;
    const t = Math.max(0, Math.min(1, -(from.x * dx + from.z * dz) / (dx * dx + dz * dz || 1)));
    const closest = Math.hypot(from.x + t * dx, from.z + t * dz);
    return closest <= maxRangeNm && Math.max(from.rangeNm, to.rangeNm) >= minRangeNm;
  });
}

function inBand(value, minimum, maximum) {
  return value >= minimum && value <= maximum;
}
