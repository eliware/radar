import { expect, jest, test } from "@jest/globals";
import { createViewChangeListeners } from "../../src/frontend/create-view-change-listeners.mjs";
import { createCanvasRadarState } from "../../src/frontend/create-canvas-radar-state.mjs";

test("reports Canvas view state and resets the view", () => {
  const state = { range: 20, autoZoom: false, offsetX: 8, offsetY: 4, rotation: 1 };
  const draw = jest.fn();
  const distances = jest.fn(() => [32]);
  const changes = createViewChangeListeners();
  const view = createCanvasRadarState(state, draw, distances, changes);
  expect(view.northAngle()).toBe(1);
  expect(view.range()).toBe(20);
  const listener = jest.fn();
  const detach = view.onViewChange(listener);
  expect(listener).toHaveBeenCalledTimes(1);
  changes.emit(20);
  expect(listener).toHaveBeenCalledTimes(2);
  view.reset();
  expect(state).toEqual({ range: 37, autoZoom: true, offsetX: 0, offsetY: 0, rotation: 0 });
  expect(distances).toHaveBeenCalledTimes(1);
  expect(draw).toHaveBeenCalledTimes(1);
  detach();
  changes.clear();
});
