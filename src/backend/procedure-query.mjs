import { createProcedurePaths } from "./procedure-paths.mjs";
import { selectProcedurePaths } from "./select-procedure-paths.mjs";
import { SID_QUERY, STAR_QUERY } from "./procedure-query-rules.mjs";

export function createProcedureQuery(database) {
  const sidStatement = database.prepare(SID_QUERY);
  const starStatement = database.prepare(STAR_QUERY);
  let paths;
  return (location, minRangeNm, maxRangeNm) => {
    paths ??= createProcedurePaths([...sidStatement.all(), ...starStatement.all()]);
    return selectProcedurePaths(paths, location, minRangeNm, maxRangeNm);
  };
}
