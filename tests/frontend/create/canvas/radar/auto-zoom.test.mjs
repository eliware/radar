import { expect, test } from "@jest/globals";
import { updateCanvasRadarAutoZoom } from "../../../../../src/frontend/create/canvas/radar/auto-zoom.mjs";

test("updates the range from local distances when auto-zoom is enabled", () => {
  const state = { autoZoom: true, defaultRangeNm: 20, range: 10 };
  updateCanvasRadarAutoZoom(state, [40]);
  expect(state.range).toBe(45);
});

test("keeps the current range when auto-zoom is disabled", () => {
  const state = { autoZoom: false, range: 24 };
  updateCanvasRadarAutoZoom(state, [40]);
  expect(state.range).toBe(24);
});
