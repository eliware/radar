import { default as distanceNauticalMiles } from "../../shared/distance-nautical-miles.mjs";
import { default as ilsSystemKey } from "./system-key.mjs";

function createIlsMarkerIndex(rows, location) {
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
export default createIlsMarkerIndex;
