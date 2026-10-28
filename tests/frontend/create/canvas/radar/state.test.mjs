import { expect, jest, test } from "@jest/globals";
import { createViewChangeListeners } from "../../../../../src/frontend/create/view-change-listeners.mjs";
import { createCanvasRadarState } from "../../../../../src/frontend/create/canvas/radar/state.mjs";

test("reports Canvas view state and subscribes to view changes", () => {
  const state = { range: 20, autoZoom: false, offsetX: 8, offsetY: 4, rotation: 1 };
  const draw = jest.fn();
  const changes = createViewChangeListeners();
  const view = createCanvasRadarState(state, draw, () => [], changes);
  expect(view.northAngle()).toBe(1);
  expect(view.range()).toBe(20);
  const listener = jest.fn();
  const detach = view.onViewChange(listener);
  expect(listener).toHaveBeenCalledTimes(1);
  changes.emit(20);
  expect(listener).toHaveBeenCalledTimes(2);
  detach();
  changes.clear();
});

test("zooms within range limits and rotates from keyboard controls", () => {
  const state = { range: 20, autoZoom: true, rotation: 0 };
  const draw = jest.fn();
  const view = createCanvasRadarState(state, draw, () => [], createViewChangeListeners());
  view.zoomBy(0.5);
  expect(state.range).toBe(10);
  expect(state.autoZoom).toBe(false);
  view.rotateBy(Math.PI / 12);
  expect(state.rotation).toBe(Math.PI / 12);
  expect(draw).toHaveBeenCalledTimes(2);
});

test("sets an absolute rotation and redraws", () => {
  const state = { range: 20, rotation: 0 };
  const draw = jest.fn();
  const view = createCanvasRadarState(state, draw, () => [], createViewChangeListeners());
  view.setRotation((140 * Math.PI) / 180);
  expect(state.rotation).toBeCloseTo((-140 * Math.PI) / 180);
  expect(draw).toHaveBeenCalledTimes(1);
});
