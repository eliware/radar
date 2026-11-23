import { default as attachAirportRunways } from "./runway/attach.mjs";
import { RUNWAY_QUERY } from "./runway/query.mjs";
import { AIRPORT_QUERY } from "../sql-query-rules.mjs";
import { default as mapReferenceInRange } from "../reference/range/query.mjs";
import { default as rowsWithinBounds } from "../reference/range/rows.mjs";

function createAirportReferenceQuery(database) {
  const airportStatement = database.prepare(AIRPORT_QUERY);
  const runwayStatement = database.prepare(RUNWAY_QUERY);
  return (location, minRangeNm, maxRangeNm) => {
    const airports = rowsWithinBounds(airportStatement, location, maxRangeNm)
      .map((row) => mapReferenceInRange(row, location, minRangeNm, maxRangeNm))
      .filter(Boolean);
    return attachAirportRunways(airports, runwayStatement);
  };
}
export default createAirportReferenceQuery;
