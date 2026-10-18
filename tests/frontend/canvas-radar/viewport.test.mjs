import { expect, test } from "@jest/globals";
import { getRadarCanvasViewport } from "../../../src/frontend/canvas-radar/viewport.mjs";

test("builds viewport bounds from canvas dimensions and current view state", () => {
  const canvas = { clientWidth: 400, clientHeight: 800 };
  const state = { range: 20, offsetX: 10, offsetY: 5, rotation: 0 };
  expect(getRadarCanvasViewport(canvas, state)).toMatchObject({
    minRangeNm: 0,
    visibleRadiusNm: expect.any(Number),
  });
});
