import { attachAirportRunways } from "./runway/attach.mjs";
import { RUNWAY_QUERY } from "./runway/query.mjs";
import { AIRPORT_QUERY } from "../sql-query-rules.mjs";
import { mapReferenceInRange, rowsWithinBounds } from "../reference/range/query.mjs";

export function createAirportReferenceQuery(database) {
  const airportStatement = database.prepare(AIRPORT_QUERY);
  const runwayStatement = database.prepare(RUNWAY_QUERY);
  return (location, minRangeNm, maxRangeNm) => {
    const airports = rowsWithinBounds(airportStatement, location, maxRangeNm)
      .map((row) => mapReferenceInRange(row, location, minRangeNm, maxRangeNm))
      .filter(Boolean);
    return attachAirportRunways(airports, runwayStatement);
  };
}
