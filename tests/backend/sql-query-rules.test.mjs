import { expect, test } from "@jest/globals";
import { AIRPORT_QUERY, NAVAID_QUERY } from "../../src/backend/sql-query-rules.mjs";

test("limits airport queries to public paved fields", () => {
  expect(AIRPORT_QUERY).toContain("A.FACILITY_USE_CODE = 'PU'");
  expect(AIRPORT_QUERY).toContain("A.ICAO_ID GLOB 'K[A-Z0-9][A-Z0-9][A-Z0-9]'");
  expect(AIRPORT_QUERY).toContain("CAST(R.RWY_LEN AS REAL) > 1000");
});

test("limits navaid queries to supported VOR types and coordinate bounds", () => {
  expect(NAVAID_QUERY).toContain("'VOR', 'VOR/DME', 'VORTAC'");
  expect(NAVAID_QUERY).toContain("CAST(LAT_DECIMAL AS REAL) BETWEEN ? AND ?");
  expect(NAVAID_QUERY).toContain("CAST(LONG_DECIMAL AS REAL) BETWEEN ? AND ?");
});
