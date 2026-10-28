import { createProcedurePaths } from "./paths.mjs";
import { selectProcedurePaths } from "./select-paths.mjs";
import { SID_QUERY, STAR_QUERY } from "./query-rules.mjs";
import { labelProcedurePaths } from "../label-procedure-paths.mjs";

export function createProcedureQuery(database) {
  const sidStatement = database.prepare(SID_QUERY);
  const starStatement = database.prepare(STAR_QUERY);
  let paths;
  return (location, minRangeNm, maxRangeNm) => {
    paths ??= createProcedurePaths([...sidStatement.all(), ...starStatement.all()]);
    labelProcedurePaths(paths);
    return selectProcedurePaths(paths, location, minRangeNm, maxRangeNm);
  };
}
