import { expect, jest, test } from "@jest/globals";
import { createCanvasRadarControls } from "../../src/frontend/create-canvas-radar-controls.mjs";

test("zooms, rotates, and resets the Canvas radar view", () => {
  const state = { range: 20, autoZoom: true, offsetX: 8, offsetY: 4, rotation: 1 };
  const draw = jest.fn();
  const distances = jest.fn(() => [32]);
  const controls = createCanvasRadarControls(state, draw, distances);
  controls.zoom(0.5);
  expect(state).toMatchObject({ range: 10, autoZoom: false });
  controls.rotate(1);
  expect(state.rotation).toBeCloseTo(1 + Math.PI / 12);
  controls.rotateBy(Math.PI / 2);
  expect(state.rotation).toBeCloseTo(1 + Math.PI / 12 + Math.PI / 2);
  controls.orbitBy(0.2, 0.1);
  expect(controls.northAngle()).toBeCloseTo(1 + Math.PI / 12 + Math.PI / 2 + 0.2);
  controls.reset();
  expect(state).toMatchObject({ range: 37, autoZoom: true, offsetX: 0, offsetY: 0, rotation: 0 });
  expect(draw).toHaveBeenCalledTimes(5);
});
