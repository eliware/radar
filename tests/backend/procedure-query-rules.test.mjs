import { expect, test } from "@jest/globals";
import { SID_QUERY, STAR_QUERY } from "../../src/backend/procedure-query-rules.mjs";

test("selects and sorts SID and STAR fixes with FAA coordinates", () => {
  expect(SID_QUERY).toContain("FROM DP_RTE R JOIN DP_BASE B");
  expect(SID_QUERY).toContain("LEFT JOIN FIX_BASE F");
  expect(SID_QUERY).toContain("LEFT JOIN NAV_BASE N");
  expect(SID_QUERY).toContain("'SID' AS type");
  expect(STAR_QUERY).toContain("FROM STAR_RTE R JOIN STAR_BASE B");
  expect(STAR_QUERY).toContain("'STAR' AS type");
  expect(STAR_QUERY).toContain("TRANSITION_COMPUTER_CODE");
  expect(STAR_QUERY).toContain("CAST(R.POINT_SEQ AS INTEGER)");
});
