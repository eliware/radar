import { expect, test } from "@jest/globals";
import { getRadarRingSpacing } from "../../../../src/frontend/radar/ring/spacing.mjs";

test("selects ring spacing for the current radar range", () => {
  expect(getRadarRingSpacing(3)).toBe(2);
  expect(getRadarRingSpacing(20)).toBe(10);
  expect(getRadarRingSpacing(100)).toBe(20);
  expect(getRadarRingSpacing(300)).toBe(50);
});
