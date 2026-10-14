import { expect, test } from "@jest/globals";
import {
  DEFAULT_RADAR_RANGE_NM,
  DEFAULT_RADAR_ROTATION_DEGREES,
  parseRadarViewSettings,
} from "../../src/shared/radar-view-settings.mjs";

test("uses default radar view settings when values are absent", () => {
  expect(parseRadarViewSettings({})).toEqual({
    defaultRangeNm: DEFAULT_RADAR_RANGE_NM,
    defaultRotationDegrees: DEFAULT_RADAR_ROTATION_DEGREES,
  });
  expect(
    parseRadarViewSettings({ RADAR_DEFAULT_RANGE_NM: "", RADAR_DEFAULT_ROTATION: "" }),
  ).toEqual({
    defaultRangeNm: 20,
    defaultRotationDegrees: 0,
  });
});

test("parses configured range and rotation", () => {
  expect(
    parseRadarViewSettings({ RADAR_DEFAULT_RANGE_NM: "25", RADAR_DEFAULT_ROTATION: "140" }),
  ).toEqual({ defaultRangeNm: 25, defaultRotationDegrees: 140 });
});

test.each([
  ["RADAR_DEFAULT_RANGE_NM", "0", "RADAR_DEFAULT_RANGE_NM must be a number from 1 through 300."],
  ["RADAR_DEFAULT_RANGE_NM", "301", "RADAR_DEFAULT_RANGE_NM must be a number from 1 through 300."],
  ["RADAR_DEFAULT_RANGE_NM", "bad", "RADAR_DEFAULT_RANGE_NM must be a number from 1 through 300."],
  ["RADAR_DEFAULT_ROTATION", "-1", "RADAR_DEFAULT_ROTATION must be an integer from 0 through 359."],
  [
    "RADAR_DEFAULT_ROTATION",
    "360",
    "RADAR_DEFAULT_ROTATION must be an integer from 0 through 359.",
  ],
  [
    "RADAR_DEFAULT_ROTATION",
    "1.5",
    "RADAR_DEFAULT_ROTATION must be an integer from 0 through 359.",
  ],
])("rejects invalid %s value %s", (key, value, message) => {
  expect(() => parseRadarViewSettings({ [key]: value })).toThrow(message);
});
