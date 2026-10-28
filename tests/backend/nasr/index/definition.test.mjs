import { expect, test } from "@jest/globals";
import {
  normalizeNasrIndexSql,
  parseNasrIndexDefinition,
} from "../../../../src/backend/nasr/index/definition.mjs";

test("parses index names and normalizes SQL definitions", () => {
  expect(
    parseNasrIndexDefinition("CREATE INDEX IF NOT EXISTS radar_sample ON airports (icao)"),
  ).toEqual({
    name: "radar_sample",
    definition: "CREATE INDEX RADAR_SAMPLE ON AIRPORTS (ICAO)",
  });
  expect(normalizeNasrIndexSql(" create   index radar_sample\n on airports (icao) ")).toBe(
    "CREATE INDEX RADAR_SAMPLE ON AIRPORTS (ICAO)",
  );
  expect(normalizeNasrIndexSql(undefined)).toBeUndefined();
});
