import { distanceNauticalMiles } from "../shared/distance-nautical-miles.mjs";
import { AIRPORT_QUERY, NAVAID_QUERY, RUNWAY_QUERY } from "./sql-query-rules.mjs";

export function createAirportReferenceQueries(database) {
  const airportStatement = database.prepare(AIRPORT_QUERY);
  const runwayStatement = database.prepare(RUNWAY_QUERY);
  const navaidStatement = database.prepare(NAVAID_QUERY);
  return {
    findBetween: (location, minRangeNm, maxRangeNm) =>
      rowsBetween(airportStatement, location, maxRangeNm).flatMap((row) => {
        const airport = mapInRange(row, location, minRangeNm, maxRangeNm);
        return airport
          ? [{ ...airport, runways: groupRunwayEnds(runwayStatement.all(row.faaId)) }]
          : [];
      }),
    findNavaidsBetween: (location, minRangeNm, maxRangeNm) =>
      rowsBetween(navaidStatement, location, maxRangeNm).flatMap((row) => {
        const navaid = mapInRange(row, location, minRangeNm, maxRangeNm);
        return navaid ? [navaid] : [];
      }),
  };
}

function rowsBetween(statement, location, maxRangeNm) {
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

function mapInRange(row, location, minRangeNm, maxRangeNm) {
  if (!Number.isFinite(row.latitude) || !Number.isFinite(row.longitude)) return null;
  const rangeNm = distanceNauticalMiles(location, row);
  if (rangeNm < minRangeNm || (minRangeNm > 0 && rangeNm <= minRangeNm) || rangeNm > maxRangeNm) {
    return null;
  }
  return { ...row, rangeNm };
}

function groupRunwayEnds(ends) {
  const groups = new Map();
  for (const end of ends) {
    if (!Number.isFinite(end.latitude) || !Number.isFinite(end.longitude)) continue;
    if (!Number.isFinite(end.alignmentDegrees)) continue;
    const group = groups.get(end.runwayId) ?? [];
    group.push(end);
    groups.set(end.runwayId, group);
  }
  return [...groups.values()].filter((group) => group.length === 2);
}
