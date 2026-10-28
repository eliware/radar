import { expect, test } from "@jest/globals";
import { normalizeNasrIndexSql } from "../../../../src/backend/nasr/index/normalize-definition.mjs";

test("normalizes NASR index SQL", () => {
  expect(normalizeNasrIndexSql(" create   index radar_sample\n on airports (icao) ")).toBe(
    "CREATE INDEX RADAR_SAMPLE ON AIRPORTS (ICAO)",
  );
  expect(normalizeNasrIndexSql(undefined)).toBeUndefined();
});
