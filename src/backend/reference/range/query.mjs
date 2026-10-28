import { distanceNauticalMiles } from "../../../shared/distance-nautical-miles.mjs";

export function mapReferenceInRange(row, location, minRangeNm, maxRangeNm) {
  if (!Number.isFinite(row.latitude) || !Number.isFinite(row.longitude)) return null;
  const rangeNm = distanceNauticalMiles(location, row);
  if (rangeNm < minRangeNm || (minRangeNm > 0 && rangeNm <= minRangeNm) || rangeNm > maxRangeNm)
    return null;
  return { ...row, rangeNm };
}
