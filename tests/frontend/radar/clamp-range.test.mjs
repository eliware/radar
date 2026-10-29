import { expect, test } from "@jest/globals";
import { clampRadarRange } from "../../../src/frontend/radar/clamp-range.mjs";

test("preserves values at supported limits and fractional manual ranges", () => {
  expect(clampRadarRange(1)).toBe(1);
  expect(clampRadarRange(1.25)).toBe(1.25);
  expect(clampRadarRange(300)).toBe(300);
});
