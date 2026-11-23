import { expect, test } from "@jest/globals";
import { default as getRadarRingRanges } from "../../../../src/frontend/radar/ring/ranges.mjs";

test("generates the minimum-range ring", () => {
  expect(getRadarRingRanges(1)).toEqual([1]);
});
