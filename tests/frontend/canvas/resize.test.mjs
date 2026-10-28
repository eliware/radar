import { expect, jest, test } from "@jest/globals";
import { resizeCanvasBackingStore } from "../../../src/frontend/canvas/resize.mjs";

test("resizes the backing store and updates the pixel ratio transform", () => {
  const canvas = { width: 0, height: 0 };
  const context = { setTransform: jest.fn() };
  expect(resizeCanvasBackingStore(canvas, context, 201, 101, 2)).toBe(true);
  expect(canvas).toMatchObject({ width: 402, height: 202 });
  expect(context.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);
});

test("keeps dimensions stable and refreshes the transform only when the ratio changes", () => {
  const canvas = { width: 400, height: 200 };
  const context = { setTransform: jest.fn() };
  expect(resizeCanvasBackingStore(canvas, context, 200, 100, 2)).toBe(false);
  expect(resizeCanvasBackingStore(canvas, context, 200, 100, 2)).toBe(false);
  expect(context.setTransform).toHaveBeenCalledTimes(1);
  expect(resizeCanvasBackingStore(canvas, context, 200, 100, 1)).toBe(true);
  expect(canvas).toMatchObject({ width: 200, height: 100 });
  expect(context.setTransform).toHaveBeenCalledTimes(2);
});
