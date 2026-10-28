import { distanceNauticalMiles } from "../../../shared/distance-nautical-miles.mjs";
import { ilsSystemKey } from "../system-key.mjs";

export function mapIlsApproachRows(rows, location, minRangeNm, maxRangeNm, markersBySystem) {
  return rows.flatMap((row) => {
    if (!Number.isFinite(row.latitude) || !Number.isFinite(row.longitude)) return [];
    const rangeNm = distanceNauticalMiles(location, row);
    if (rangeNm < minRangeNm || (minRangeNm > 0 && rangeNm <= minRangeNm) || rangeNm > maxRangeNm)
      return [];
    return [{ ...row, rangeNm, markers: markersBySystem.get(ilsSystemKey(row)) ?? [] }];
  });
}
