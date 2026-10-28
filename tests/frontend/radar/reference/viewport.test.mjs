import { expect, test } from "@jest/globals";
import { createRadarViewport } from "../../../../src/frontend/radar/reference/viewport.mjs";

test("viewport bounds include the rotated mobile screen and cap fetch range", () => {
  const bounds = createRadarViewport(400, 800, 20, 0, 0, 0);
  expect(bounds.minX).toBeLessThan(-20);
  expect(bounds.maxX).toBeGreaterThan(20);
  expect(bounds.maxRangeNm).toBeLessThan(100);
  expect(bounds.visibleRadiusNm).toBeLessThan(bounds.maxRangeNm);
  expect(createRadarViewport(400, 800, 300, 0, 0, 0).maxRangeNm).toBe(300);
});
