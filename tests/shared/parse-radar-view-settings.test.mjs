import { expect, test } from "@jest/globals";
import { parseRadarViewSettings } from "../../src/shared/parse-radar-view-settings.mjs";

test("combines configured radar range and rotation", () => {
  expect(
    parseRadarViewSettings({ RADAR_DEFAULT_RANGE_NM: "25", RADAR_DEFAULT_ROTATION: "140" }),
  ).toEqual({ defaultRangeNm: 25, defaultRotationDegrees: 140 });
});
