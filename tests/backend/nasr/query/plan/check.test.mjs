import { expect, test } from "@jest/globals";
import { NASR_QUERY_PLAN_CASES } from "../../../../../src/backend/nasr/query/plan/cases.mjs";
import { verifyNasrQueryPlan } from "../../../../../src/backend/nasr/query/plan/check.mjs";

test("checks one representative plan for all required indexes", () => {
  const queryPlanCase = NASR_QUERY_PLAN_CASES[0];
  const [, , parameters, indexes] = queryPlanCase;
  const database = {
    prepare: (sql) => ({
      all: (...actualParameters) => {
        expect(sql).toBe(`EXPLAIN QUERY PLAN ${queryPlanCase[1]}`);
        expect(actualParameters).toEqual(parameters);
        return indexes.map((index) => ({ detail: `USING INDEX ${index}` }));
      },
    }),
  };
  expect(() => verifyNasrQueryPlan(database, queryPlanCase)).not.toThrow();
});

test("reports the first required index missing from a plan", () => {
  const queryPlanCase = ["sample", "SELECT 1", [], ["radar_required"]];
  const database = { prepare: () => ({ all: () => [{ detail: "SCAN table" }] }) };
  expect(() => verifyNasrQueryPlan(database, queryPlanCase)).toThrow(
    "NASR sample query plan does not use radar_required.",
  );
});
