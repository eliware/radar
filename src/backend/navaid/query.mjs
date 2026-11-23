import { NAVAID_QUERY } from "../sql-query-rules.mjs";
import { default as mapReferenceInRange } from "../reference/range/query.mjs";
import { default as rowsWithinBounds } from "../reference/range/rows.mjs";

function createNavaidQuery(database) {
  const statement = database.prepare(NAVAID_QUERY);
  return (location, minRangeNm, maxRangeNm) =>
    rowsWithinBounds(statement, location, maxRangeNm).flatMap((row) => {
      const navaid = mapReferenceInRange(row, location, minRangeNm, maxRangeNm);
      return navaid ? [navaid] : [];
    });
}
export default createNavaidQuery;
