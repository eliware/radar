import { expect, test } from "@jest/globals";
import { DatabaseSync } from "node:sqlite";
import { SID_QUERY, STAR_QUERY } from "../../../src/backend/procedure/query-rules.mjs";

test("selects and sorts SID and STAR fixes with FAA coordinates", () => {
  expect(SID_QUERY).toContain("FROM DP_RTE R JOIN DP_BASE B");
  expect(SID_QUERY).toContain("LEFT JOIN FIX_BASE F");
  expect(SID_QUERY).toContain("LEFT JOIN NAV_BASE N");
  expect(SID_QUERY).toContain("N.NAV_TYPE = TRIM(R.POINT_TYPE)");
  expect(SID_QUERY).toContain("'SID' AS type");
  expect(STAR_QUERY).toContain("FROM STAR_RTE R JOIN STAR_BASE B");
  expect(STAR_QUERY).toContain("'STAR' AS type");
  expect(STAR_QUERY).toContain("TRANSITION_COMPUTER_CODE");
  expect(STAR_QUERY).toContain("CAST(R.POINT_SEQ AS INTEGER)");
  expect(STAR_QUERY).toContain("N.NAV_TYPE = TRIM(R.POINT_TYPE)");
});

test("matches duplicate procedure navaid identifiers by point type", () => {
  const database = new DatabaseSync(":memory:");
  database.exec(`
    CREATE TABLE DP_RTE (
      EFF_DATE, DP_COMPUTER_CODE, ROUTE_PORTION_TYPE, ROUTE_NAME, BODY_SEQ,
      TRANSITION_COMPUTER_CODE, ARPT_RWY_ASSOC, POINT_SEQ, POINT, POINT_TYPE,
      ICAO_REGION_CODE
    );
    CREATE TABLE DP_BASE (EFF_DATE, DP_COMPUTER_CODE, DP_NAME, SERVED_ARPT);
    CREATE TABLE APT_BASE (ARPT_ID, LAT_DECIMAL, LONG_DECIMAL);
    CREATE TABLE FIX_BASE (FIX_ID, ICAO_REGION_CODE, LAT_DECIMAL, LONG_DECIMAL);
    CREATE TABLE NAV_BASE (NAV_ID, NAV_TYPE, LAT_DECIMAL, LONG_DECIMAL);
    INSERT INTO DP_RTE VALUES (
      '2026', 'D1', 'COMMON', 'TEST1', '1', '', '', '1', 'ABQ', 'VORTAC', 'US'
    );
    INSERT INTO DP_BASE VALUES ('2026', 'D1', 'TEST DEPARTURE', 'PWM');
    INSERT INTO NAV_BASE VALUES ('ABQ', 'VORTAC', '35.04379558', '-106.81631191');
    INSERT INTO NAV_BASE VALUES ('ABQ', 'VOT', '35.03819', '-106.60841805');
  `);
  const result = database.prepare(SID_QUERY).all();
  expect(result).toHaveLength(1);
  expect(result[0].fixType).toBe("VORTAC");
  expect(result[0].latitude).toBeCloseTo(35.04379558);
  expect(result[0].longitude).toBeCloseTo(-106.81631191);
  database.close();
});
