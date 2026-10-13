import { expect, test } from "@jest/globals";
import {
  AIRPORT_QUERY,
  NAVAID_QUERY,
  RUNWAY_QUERY,
} from "../../src/backend/airport-database-queries.mjs";

test("airport query selects only public-use K-code airports with paved runways", () => {
  expect(AIRPORT_QUERY).toContain("A.FACILITY_USE_CODE = 'PU'");
  expect(AIRPORT_QUERY).toContain("A.ICAO_ID GLOB 'K[A-Z0-9][A-Z0-9][A-Z0-9]'");
  expect(AIRPORT_QUERY).toContain("R.SURFACE_TYPE_CODE IN ('ASPH', 'CONC'");
  expect(AIRPORT_QUERY).toContain("CAST(R.RWY_LEN AS REAL) > 1000");
});

test("runway query selects qualifying paved runway ends", () => {
  expect(RUNWAY_QUERY).toContain("JOIN APT_RWY R");
  expect(RUNWAY_QUERY).toContain("E.RWY_END_ELEV");
  expect(RUNWAY_QUERY).toContain("AS elevationFeet");
  expect(RUNWAY_QUERY).toContain("R.SURFACE_TYPE_CODE IN ('ASPH', 'CONC'");
  expect(RUNWAY_QUERY).toContain("CAST(R.RWY_LEN AS REAL) > 1000");
});

test("navaid query selects the supported VOR types", () => {
  expect(NAVAID_QUERY).toContain("'VOR', 'VOR/DME', 'VORTAC'");
  expect(NAVAID_QUERY).toContain("BETWEEN ? AND ?");
});
