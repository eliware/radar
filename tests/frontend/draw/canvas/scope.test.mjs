import { expect, jest, test } from "@jest/globals";
import { createCanvasRadarScope } from "../../../../src/frontend/draw/canvas/scope.mjs";

function createContext() {
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
  context.measureText = jest.fn((text) => ({ width: text.length * 8 }));
  return context;
}

test("prepares a minimum canvas and draws close range rings", () => {
  const context = createContext();
  const canvas = { clientWidth: 0, clientHeight: 0 };
  const scope = createCanvasRadarScope(context, canvas, 3, 0, 0, { devicePixelRatio: 0 });
  scope.drawRings();
  expect(canvas.width).toBe(1);
  expect(canvas.height).toBe(1);
  expect(scope.radius).toBe(1);
  expect(context.arc).toHaveBeenCalledTimes(3);
  expect(context.clip).not.toHaveBeenCalled();
  expect(context.fillText).toHaveBeenCalledWith("3", expect.any(Number), expect.any(Number));
});

test("positions and rotates a disconnected radar scope", () => {
  const context = createContext();
  const canvas = { clientWidth: 300, clientHeight: 200 };
  const scope = createCanvasRadarScope(
    context,
    canvas,
    30,
    5,
    7,
    { devicePixelRatio: 1 },
    Math.PI / 4,
    false,
  );
  scope.drawRings();
  expect(scope).toMatchObject({ width: 300, height: 200, centerX: 155, centerY: 107 });
  expect(context.rotate).toHaveBeenCalledWith(Math.PI / 4);
  expect(context.restore).toHaveBeenCalled();
});
