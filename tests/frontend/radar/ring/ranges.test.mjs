import { expect, test } from "@jest/globals";
import { getRadarRingRanges } from "../../../../src/frontend/radar/ring/ranges.mjs";

test("generates half-step ring distances through the radar range", () => {
  expect(getRadarRingRanges(20)).toEqual([5, 10, 15, 20]);
  expect(getRadarRingRanges(300)).toHaveLength(12);
});
