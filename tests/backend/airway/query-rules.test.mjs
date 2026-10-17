import { expect, test } from "@jest/globals";
import { AIRWAY_QUERY } from "../../../src/backend/airway/query-rules.mjs";

test("queries current Q, J, and V airway segments with fix and navaid coordinates", () => {
  expect(AIRWAY_QUERY).toContain("FROM AWY_SEG_ALT S");
  expect(AIRWAY_QUERY).toContain("IN ('Q', 'J', 'V')");
  expect(AIRWAY_QUERY).toContain("LEFT JOIN FIX_BASE F");
  expect(AIRWAY_QUERY).toContain("LEFT JOIN NAV_BASE N");
  expect(AIRWAY_QUERY).toContain("S.TO_POINT AS nextFix");
});
