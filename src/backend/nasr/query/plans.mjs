import { NASR_QUERY_PLAN_CASES } from "./plan-cases.mjs";

export function verifyNasrQueryPlans(database) {
  for (const [name, query, parameters, indexes] of NASR_QUERY_PLAN_CASES) {
    const plan = database
      .prepare(`EXPLAIN QUERY PLAN ${query}`)
      .all(...parameters)
      .map((row) => row.detail)
      .join("\n");
    for (const index of indexes) {
      if (!plan.includes(index)) throw new Error(`NASR ${name} query plan does not use ${index}.`);
    }
  }
}
