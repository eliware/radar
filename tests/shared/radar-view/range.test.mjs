import { expect, test } from "@jest/globals";
import {
  DEFAULT_RADAR_RANGE_NM,
  parseRadarRangeSetting,
} from "../../../src/shared/radar-view/range.mjs";

test("uses the default range for absent and empty values", () => {
  expect(parseRadarRangeSetting(undefined)).toBe(DEFAULT_RADAR_RANGE_NM);
  expect(parseRadarRangeSetting("")).toBe(DEFAULT_RADAR_RANGE_NM);
});

test("parses valid range bounds and rejects invalid values", () => {
  expect(parseRadarRangeSetting("1")).toBe(1);
  expect(parseRadarRangeSetting("25")).toBe(25);
  expect(parseRadarRangeSetting("300")).toBe(300);
  for (const value of ["0", "301", "bad"]) {
    expect(() => parseRadarRangeSetting(value)).toThrow(
      "RADAR_DEFAULT_RANGE_NM must be a number from 1 through 300.",
    );
  }
});
