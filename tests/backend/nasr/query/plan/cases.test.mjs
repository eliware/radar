import { expect, test } from "@jest/globals";
import { NASR_QUERY_PLAN_CASES } from "../../../../../src/backend/nasr/query/plan/cases.mjs";

test("registers representative NASR query plan cases with required indexes", () => {
  expect(NASR_QUERY_PLAN_CASES).toHaveLength(9);
  expect(NASR_QUERY_PLAN_CASES.map(([name]) => name)).toEqual([
    "airports",
    "runways",
    "navaids",
    "airways",
    "SIDs",
    "STARs",
    "ILS approaches",
    "ILS markers",
    "ARTCC boundaries",
  ]);
  for (const [, query, parameters, indexes] of NASR_QUERY_PLAN_CASES) {
    expect(query).toContain("SELECT");
    expect(parameters).toEqual(expect.any(Array));
    expect(indexes.length).toBeGreaterThan(0);
  }
});
