import { expect, jest, test } from "@jest/globals";
import { NASR_QUERY_PLAN_CASES } from "../../../../src/backend/nasr/query/plan/cases.mjs";
import { verifyNasrQueryPlans } from "../../../../src/backend/nasr/query/plans.mjs";

test("checks every query plan case", () => {
  const prepare = jest.fn((sql) => {
    const queryPlanCase = NASR_QUERY_PLAN_CASES.find(
      ([, query]) => sql === `EXPLAIN QUERY PLAN ${query}`,
    );
    return {
      all: (...parameters) => {
        expect(parameters).toEqual(queryPlanCase[2]);
        return queryPlanCase[3].map((index) => ({ detail: `USING INDEX ${index}` }));
      },
    };
  });
  verifyNasrQueryPlans({ prepare });
  expect(prepare.mock.calls.map(([sql]) => sql)).toEqual(
    NASR_QUERY_PLAN_CASES.map(([, query]) => `EXPLAIN QUERY PLAN ${query}`),
  );
});
