import { distanceNauticalMiles } from "../shared/distance-nautical-miles.mjs";

export function createIlsMarkerIndex(rows, location) {
  const groups = new Map();
  for (const row of rows) {
    if (!Number.isFinite(row.latitude) || !Number.isFinite(row.longitude)) continue;
    const key = ilsSystemKey(row);
    const markers = groups.get(key) ?? [];
    markers.push({ ...row, rangeNm: distanceNauticalMiles(location, row) });
    groups.set(key, markers);
  }
  return groups;
}

export function ilsSystemKey(record) {
  return `${record.faaId}:${record.runwayEnd}:${record.identifier}:${record.systemType}`;
}
