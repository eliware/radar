import { expect, test } from "@jest/globals";
import { clampRadarRange } from "../../../src/frontend/radar/clamp-range.mjs";

test("clamps ranges to the supported bounds and defaults invalid values", () => {
  expect(clampRadarRange(0)).toBe(1);
  expect(clampRadarRange(42)).toBe(42);
  expect(clampRadarRange(301)).toBe(300);
  expect(clampRadarRange(Number.NaN)).toBe(20);
});
