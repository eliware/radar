import { expect, test } from "@jest/globals";
import { calculateCanvasWaterView } from "../../../src/frontend/water/canvas-view.mjs";

test("calculates a north-up center and stable request key", () => {
  const view = calculateCanvasWaterView(
    { latitude: 43, longitude: -70 },
    { clientWidth: 200, clientHeight: 100 },
    { range: 20, offsetX: 0, offsetY: -22, rotation: 0 },
  );
  expect(view.center.latitude).toBeCloseTo(43.1667, 3);
  expect(view.center.longitude).toBeCloseTo(-70);
  expect(view.key).toBe(JSON.stringify([view.center, 20]));
});

test("uses minimum canvas dimensions and accounts for rotation", () => {
  const view = calculateCanvasWaterView(
    { latitude: 0, longitude: 0 },
    { clientWidth: 0, clientHeight: 0 },
    { range: 10, offsetX: 1, offsetY: 0, rotation: Math.PI / 2 },
  );
  expect(view.center.latitude).toBeCloseTo(10 / 60);
  expect(view.center.longitude).toBeCloseTo(0);
});

test("produces a null center when no home location is configured", () => {
  expect(
    calculateCanvasWaterView(null, { clientWidth: 100, clientHeight: 100 }, { range: 20 }),
  ).toEqual({ center: null, key: "[null,20]" });
});
