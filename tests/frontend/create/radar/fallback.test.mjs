import { expect, jest, test } from "@jest/globals";

const createCanvasRadarView = jest.fn();
jest.unstable_mockModule("../../../../src/frontend/canvas-radar/view.mjs", () => ({
  createCanvasRadarView,
}));
const { createRadarFallback } = await import("../../../../src/frontend/create/radar/fallback.mjs");

test("creates a Canvas view when WebGL is unavailable", () => {
  const options = { container: {}, location: null, elevationFeet: 300 };
  const view = { mode: "2D" };
  createCanvasRadarView.mockReturnValueOnce(view);
  expect(createRadarFallback(new Error("WebGL context unavailable"), options)).toBe(view);
  expect(createCanvasRadarView).toHaveBeenCalledWith(options);
});

test("rethrows unrelated scene errors", () => {
  const error = new Error("broken scene setup");
  expect(() => createRadarFallback(error, {})).toThrow(error);
});
