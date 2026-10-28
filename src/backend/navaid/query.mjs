import { NAVAID_QUERY } from "../sql-query-rules.mjs";
import { mapReferenceInRange } from "../reference/range/query.mjs";
import { rowsWithinBounds } from "../reference/range/rows.mjs";

export function createNavaidQuery(database) {
  const statement = database.prepare(NAVAID_QUERY);
  return (location, minRangeNm, maxRangeNm) =>
    rowsWithinBounds(statement, location, maxRangeNm).flatMap((row) => {
      const navaid = mapReferenceInRange(row, location, minRangeNm, maxRangeNm);
      return navaid ? [navaid] : [];
    });
}
