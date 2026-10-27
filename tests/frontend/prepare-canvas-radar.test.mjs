import { expect, jest, test } from "@jest/globals";
import { prepareCanvasRadar } from "../../src/frontend/prepare-canvas-radar.mjs";

test("sets capped pixel dimensions and transform", () => {
  const context = { setTransform: jest.fn() };
  const canvas = { clientWidth: 500, clientHeight: 300 };
  expect(prepareCanvasRadar(context, canvas, { devicePixelRatio: 3 })).toEqual({
    width: 500,
    height: 300,
  });
  expect(canvas.width).toBe(1000);
  expect(canvas.height).toBe(600);
  expect(context.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);
});

test("uses one pixel dimensions when the canvas has no layout size", () => {
  const canvas = {};
  prepareCanvasRadar({ setTransform() {} }, canvas, {});
  expect(canvas.width).toBe(1);
  expect(canvas.height).toBe(1);
});

test("does not reset the canvas backing store when its dimensions are unchanged", () => {
  let writes = 0;
  const canvas = { clientWidth: 500, clientHeight: 300, width: 1000, height: 600 };
  for (const key of ["width", "height"]) {
    let value = canvas[key];
    Object.defineProperty(canvas, key, {
      get: () => value,
      set: (next) => {
        writes += 1;
        value = next;
      },
      configurable: true,
    });
  }
  prepareCanvasRadar({ setTransform() {} }, canvas, { devicePixelRatio: 2 });
  expect(writes).toBe(0);
});
