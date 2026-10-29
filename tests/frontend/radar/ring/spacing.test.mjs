import { expect, test } from "@jest/globals";
import { getRadarRingSpacing } from "../../../../src/frontend/radar/ring/spacing.mjs";

test("selects ring spacing for the current radar range", () => {
  expect(getRadarRingSpacing(9.99)).toBe(2);
  expect(getRadarRingSpacing(10)).toBe(10);
  expect(getRadarRingSpacing(59.99)).toBe(10);
  expect(getRadarRingSpacing(60)).toBe(20);
  expect(getRadarRingSpacing(149.99)).toBe(20);
  expect(getRadarRingSpacing(150)).toBe(50);
});
