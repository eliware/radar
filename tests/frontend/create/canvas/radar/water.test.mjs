import { expect, jest, test } from "@jest/globals";
import { createCanvasRadarWater } from "../../../../../src/frontend/create/canvas/radar/water.mjs";

test("owns Canvas water state and control cleanup", () => {
  const listeners = new Map();
  const documentRef = {
    addEventListener: jest.fn((name, callback) => listeners.set(name, callback)),
    removeEventListener: jest.fn(),
  };
  const draw = jest.fn();
  const water = createCanvasRadarWater(
    documentRef,
    { fetch: jest.fn() },
    null,
    {},
    { range: 20, rotation: 0, offsetX: 0, offsetY: 0 },
    () => draw,
  );
  expect(water.data).toMatchObject({ paths: [], visible: true });
  expect(draw).not.toHaveBeenCalled();
  listeners.get("keydown")({ key: "w", preventDefault: jest.fn() });
  expect(water.data.visible).toBe(false);
  expect(draw).toHaveBeenCalledTimes(1);
  water.destroy();
  expect(documentRef.removeEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
});
