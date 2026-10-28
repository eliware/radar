import { expect, test } from "@jest/globals";
import { selectWaterZoom } from "../../../../src/frontend/water/tile/zoom.mjs";

test("selects water tile zoom levels for the current range", () => {
  expect(selectWaterZoom(43.8, 20)).toBeGreaterThan(selectWaterZoom(43.8, 300));
  expect(selectWaterZoom(43.8, 1)).toBeLessThanOrEqual(14);
  expect(selectWaterZoom(0, 0)).toBe(14);
  expect(selectWaterZoom(90, 300)).toBe(0);
});
