import { expect, jest, test } from "@jest/globals";
import { resizeOverlayCanvas } from "../../../src/frontend/aircraft/resize-overlay-canvas.mjs";

test("resizes the backing store only when pixel dimensions change", () => {
  const assignments = [];
  const dimensions = {
    _width: 400,
    _height: 200,
    get width() {
      return this._width;
    },
    set width(value) {
      assignments.push(["width", value]);
      this._width = value;
    },
    get height() {
      return this._height;
    },
    set height(value) {
      assignments.push(["height", value]);
      this._height = value;
    },
  };
  const context = { setTransform: jest.fn() };
  expect(resizeOverlayCanvas(dimensions, context, 200, 100, 2)).toBe(false);
  expect(assignments).toEqual([]);
  expect(resizeOverlayCanvas(dimensions, context, 200, 100, 2)).toBe(false);
  expect(assignments).toEqual([]);
  expect(resizeOverlayCanvas(dimensions, context, 300, 100, 2)).toBe(true);
  expect(assignments).toEqual([["width", 600]]);
  expect(context.setTransform).toHaveBeenCalledTimes(2);
});
