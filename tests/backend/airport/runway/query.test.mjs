import { expect, test } from "@jest/globals";
import { RUNWAY_QUERY } from "../../../../src/backend/airport/runway/query.mjs";

test("selects paved runway ends for the requested airports", () => {
  expect(RUNWAY_QUERY).toContain("json_each(?)");
  expect(RUNWAY_QUERY).toContain("E.RWY_END_ELEV");
  expect(RUNWAY_QUERY).toContain("AS elevationFeet");
  expect(RUNWAY_QUERY).toContain("R.SURFACE_TYPE_CODE IN ('ASPH', 'CONC'");
  expect(RUNWAY_QUERY).toContain("CAST(R.RWY_LEN AS REAL) > 1000");
});
