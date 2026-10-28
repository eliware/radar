import { expect, jest, test } from "@jest/globals";
import { createViewChangeListeners } from "../../../../../src/frontend/create/view-change-listeners.mjs";
import { resetCanvasRadarView } from "../../../../../src/frontend/create/canvas/radar/reset.mjs";
import { createCanvasRadarState } from "../../../../../src/frontend/create/canvas/radar/state.mjs";

test("resets range, offsets, rotation, and auto zoom", () => {
  const state = { range: 20, autoZoom: false, offsetX: 8, offsetY: 4, rotation: 1 };
  const draw = jest.fn();
  const distances = jest.fn(() => [32]);

  resetCanvasRadarView(state, draw, distances);

  expect(state).toEqual({ range: 37, autoZoom: true, offsetX: 0, offsetY: 0, rotation: 0 });
  expect(distances).toHaveBeenCalledTimes(1);
  expect(draw).toHaveBeenCalledTimes(1);
});

test("resets to configured range and rotation", () => {
  const state = {
    range: 20,
    autoZoom: false,
    rotation: 0,
    defaultRangeNm: 25,
    defaultRotationRadians: (-140 * Math.PI) / 180,
  };

  resetCanvasRadarView(state, jest.fn(), () => []);

  expect(state.range).toBe(25);
  expect(state.rotation).toBeCloseTo((-140 * Math.PI) / 180);
});

test("exposes the reset operation through the radar view state", () => {
  const state = { range: 20, autoZoom: false, rotation: 1 };
  const view = createCanvasRadarState(state, jest.fn(), () => [], createViewChangeListeners());

  view.reset();

  expect(state).toMatchObject({ range: 20, autoZoom: true, rotation: 0 });
});
