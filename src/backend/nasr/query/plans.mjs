import { NASR_QUERY_PLAN_CASES } from "./plan/cases.mjs";
import { default as verifyNasrQueryPlan } from "./plan/check.mjs";

function verifyNasrQueryPlans(database) {
  for (const queryPlanCase of NASR_QUERY_PLAN_CASES) verifyNasrQueryPlan(database, queryPlanCase);
}
export default verifyNasrQueryPlans;
