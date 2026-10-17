import { expect, jest, test } from "@jest/globals";
import { prepareCanvasRadar } from "../../src/frontend/prepare-canvas-radar.mjs";

test("sets capped pixel dimensions and clears the canvas", () => {
  const context = { setTransform: jest.fn(), fillRect: jest.fn() };
  const canvas = { clientWidth: 500, clientHeight: 300 };
  expect(prepareCanvasRadar(context, canvas, { devicePixelRatio: 3 })).toEqual({
    width: 500,
    height: 300,
  });
  expect(canvas.width).toBe(1000);
  expect(canvas.height).toBe(600);
  expect(context.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);
  expect(context.fillRect).toHaveBeenCalledWith(0, 0, 500, 300);
});

test("uses one pixel dimensions when the canvas has no layout size", () => {
  const canvas = {};
  prepareCanvasRadar({ setTransform() {}, fillRect() {} }, canvas, {});
  expect(canvas.width).toBe(1);
  expect(canvas.height).toBe(1);
});
