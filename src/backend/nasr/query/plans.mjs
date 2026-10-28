import { NASR_QUERY_PLAN_CASES } from "./plan/cases.mjs";
import { verifyNasrQueryPlan } from "./plan/check.mjs";

export function verifyNasrQueryPlans(database) {
  for (const queryPlanCase of NASR_QUERY_PLAN_CASES) verifyNasrQueryPlan(database, queryPlanCase);
}
