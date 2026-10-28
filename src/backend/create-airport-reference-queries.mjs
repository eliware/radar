import { distanceNauticalMiles } from "../shared/distance-nautical-miles.mjs";
import { groupRunwayEnds } from "./airport/runway/groups.mjs";
import { RUNWAY_QUERY } from "./airport/runway/query.mjs";
import { AIRPORT_QUERY, NAVAID_QUERY } from "./sql-query-rules.mjs";

export function createAirportReferenceQueries(database) {
  const airportStatement = database.prepare(AIRPORT_QUERY);
  const runwayStatement = database.prepare(RUNWAY_QUERY);
  const navaidStatement = database.prepare(NAVAID_QUERY);
  return {
    findBetween: (location, minRangeNm, maxRangeNm) => {
      const airports = rowsBetween(airportStatement, location, maxRangeNm)
        .map((row) => mapInRange(row, location, minRangeNm, maxRangeNm))
        .filter(Boolean);
      if (!airports.length) return [];
      const runways = groupRunwayEnds(
        runwayStatement.all(JSON.stringify(airports.map(({ faaId }) => faaId))),
      );
      return airports.map((airport) => ({
        ...airport,
        runways: runways.get(airport.faaId) ?? [],
      }));
    },
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
