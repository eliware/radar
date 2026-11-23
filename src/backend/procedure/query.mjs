import { default as createProcedurePaths } from "./paths.mjs";
import { default as selectProcedurePaths } from "./select-paths.mjs";
import { SID_QUERY, STAR_QUERY } from "./query-rules.mjs";
import { default as labelProcedurePaths } from "../label-procedure-paths.mjs";

function createProcedureQuery(database) {
  const sidStatement = database.prepare(SID_QUERY);
  const starStatement = database.prepare(STAR_QUERY);
  let paths;
  return (location, minRangeNm, maxRangeNm) => {
    paths ??= createProcedurePaths([...sidStatement.all(), ...starStatement.all()]);
    labelProcedurePaths(paths);
    return selectProcedurePaths(paths, location, minRangeNm, maxRangeNm);
  };
}
export default createProcedureQuery;
