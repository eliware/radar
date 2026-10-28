import { distanceNauticalMiles } from "../../../shared/distance-nautical-miles.mjs";

export function rowsWithinBounds(statement, location, maxRangeNm) {
  const latitudeDelta = maxRangeNm / 60;
  const longitudeDelta =
    maxRangeNm / (60 * Math.max(0.01, Math.cos((location.latitude * Math.PI) / 180)));
  return statement.all(
    Math.max(-90, location.latitude - latitudeDelta),
    Math.min(90, location.latitude + latitudeDelta),
    Math.max(-180, location.longitude - longitudeDelta),
    Math.min(180, location.longitude + longitudeDelta),
  );
}

export function mapReferenceInRange(row, location, minRangeNm, maxRangeNm) {
  if (!Number.isFinite(row.latitude) || !Number.isFinite(row.longitude)) return null;
  const rangeNm = distanceNauticalMiles(location, row);
  if (rangeNm < minRangeNm || (minRangeNm > 0 && rangeNm <= minRangeNm) || rangeNm > maxRangeNm)
    return null;
  return { ...row, rangeNm };
}
