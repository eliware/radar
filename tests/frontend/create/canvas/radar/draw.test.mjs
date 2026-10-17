import { expect, jest, test } from "@jest/globals";
import { createCanvasRadarDraw } from "../../../../../src/frontend/create/canvas/radar/draw.mjs";

test("draws the latest targets with view and connection state", () => {
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
  context.measureText = () => ({ width: 10 });
  const targets = { items: jest.fn(() => new Map()) };
  const state = {
    range: 20,
    offsetX: 2,
    offsetY: 3,
    rotation: 0.5,
    connected: false,
  };
  const draw = createCanvasRadarDraw({
    context,
    canvas: { clientWidth: 200, clientHeight: 200 },
    targets,
    location: null,
    state,
    windowRef: { devicePixelRatio: 1 },
    trails: new Map(),
    airports: new Map(),
    navaids: new Map(),
  });
  expect(() => draw()).not.toThrow();
  expect(targets.items).toHaveBeenCalled();
});
