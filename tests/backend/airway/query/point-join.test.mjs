import { expect, test } from "@jest/globals";
import { AIRWAY_POINT_JOIN } from "../../../../src/backend/airway/query/point-join.mjs";
import { AIRWAY_QUERY } from "../../../../src/backend/airway/query-rules.mjs";

test("joins airway points to current fix and navaid coordinates", () => {
  expect(AIRWAY_POINT_JOIN).toContain("LEFT JOIN FIX_BASE F");
  expect(AIRWAY_POINT_JOIN).toContain("LEFT JOIN NAV_BASE N");
  expect(AIRWAY_QUERY).toContain("COALESCE(F.LAT_DECIMAL, N.LAT_DECIMAL)");
  expect(AIRWAY_QUERY).toContain("COALESCE(F.LONG_DECIMAL, N.LONG_DECIMAL)");
  expect(AIRWAY_POINT_JOIN).toContain("F.EFF_DATE = (SELECT MAX(EFF_DATE) FROM FIX_BASE)");
  expect(AIRWAY_POINT_JOIN).toContain("N.EFF_DATE = (SELECT MAX(EFF_DATE) FROM NAV_BASE)");
});
