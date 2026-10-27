import { AIRWAY_QUERY } from "./query-rules.mjs";
import { buildAirways } from "./path-builder.mjs";
import { pathInRange } from "./range.mjs";

export function createAirwayQuery(database) {
  const statement = database.prepare(AIRWAY_QUERY);
  let paths;
  return (location, minRangeNm, maxRangeNm) => {
    paths ??= buildAirways(statement.all(), location);
    return paths.filter((path) => pathInRange(path.points, minRangeNm, maxRangeNm));
  };
}
