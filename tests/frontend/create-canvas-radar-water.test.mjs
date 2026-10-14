import { expect, jest, test } from "@jest/globals";
import { createCanvasRadarWater } from "../../src/frontend/create-canvas-radar-water.mjs";

test("owns Canvas water state and control cleanup", () => {
  const button = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    setAttribute: jest.fn(),
  };
  const draw = jest.fn();
  const water = createCanvasRadarWater(
    { querySelector: () => button },
    { fetch: jest.fn() },
    null,
    {},
    { range: 20, rotation: 0, offsetX: 0, offsetY: 0 },
    () => draw,
  );
  expect(water.data).toMatchObject({ paths: [], visible: true });
  expect(draw).toHaveBeenCalledTimes(1);
  expect(button.addEventListener).toHaveBeenCalledWith("click", expect.any(Function));
  water.destroy();
  expect(button.removeEventListener).toHaveBeenCalledWith("click", expect.any(Function));
});
