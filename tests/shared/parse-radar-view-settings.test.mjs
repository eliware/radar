import { expect, test } from "@jest/globals";
import { parseRadarViewSettings } from "../../src/shared/parse-radar-view-settings.mjs";

test("reads configuration without mutating the environment", () => {
  const environment = { RADAR_DEFAULT_RANGE_NM: "25", RADAR_DEFAULT_ROTATION: "140" };
  const original = { ...environment };
  expect(parseRadarViewSettings(environment)).toEqual({
    defaultRangeNm: 25,
    defaultRotationDegrees: 140,
  });
  expect(environment).toEqual(original);
});
