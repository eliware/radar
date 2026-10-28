import { expect, test } from "@jest/globals";
import {
  DEFAULT_RADAR_ROTATION_DEGREES,
  parseRadarRotationSetting,
} from "../../../src/shared/radar-view/rotation.mjs";

test("uses the default rotation for absent and empty values", () => {
  expect(parseRadarRotationSetting(undefined)).toBe(DEFAULT_RADAR_ROTATION_DEGREES);
  expect(parseRadarRotationSetting("")).toBe(DEFAULT_RADAR_ROTATION_DEGREES);
});

test("parses valid integer rotation bounds and rejects invalid values", () => {
  expect(parseRadarRotationSetting("0")).toBe(0);
  expect(parseRadarRotationSetting("140")).toBe(140);
  expect(parseRadarRotationSetting("359")).toBe(359);
  for (const value of ["-1", "360", "1.5", "bad"]) {
    expect(() => parseRadarRotationSetting(value)).toThrow(
      "RADAR_DEFAULT_ROTATION must be an integer from 0 through 359.",
    );
  }
});
