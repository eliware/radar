import { expect, jest, test } from "@jest/globals";
import { drawCanvasRadarCoordinator } from "../../../../src/frontend/draw/canvas/coordinator.mjs";

test("coordinates the scope, home marker, legend, and scale layers", () => {
  const context = Object.fromEntries(
    [
      "setTransform",
      "setLineDash",
      "clearRect",
      "fillRect",
      "beginPath",
      "arc",
      "clip",
      "stroke",
      "fillText",
      "moveTo",
      "lineTo",
      "fill",
      "save",
      "translate",
      "rotate",
      "closePath",
      "restore",
    ].map((name) => [name, jest.fn()]),
  );
  drawCanvasRadarCoordinator(
    context,
    { clientWidth: 100, clientHeight: 100 },
    new Map(),
    null,
    3,
    0,
    0,
    { devicePixelRatio: 1 },
  );
  expect(context.arc).toHaveBeenCalled();
  expect(context.fillText).toHaveBeenCalledWith("3", expect.any(Number), expect.any(Number));
  expect(context.fillText.mock.calls.some(([label]) => /\d+ NM/.test(label))).toBe(true);
});
