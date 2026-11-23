import { expect, jest, test } from "@jest/globals";
import { default as drawCanvasRadarCoordinator } from "../../../../src/frontend/draw/canvas/coordinator.mjs";

test("uses the connected palette for the home marker", () => {
  const fillStyles = [];
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
  context.fill.mockImplementation(function () {
    fillStyles.push(this.fillStyle);
  });
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
  expect(fillStyles).toContain("#00ff41");
});
