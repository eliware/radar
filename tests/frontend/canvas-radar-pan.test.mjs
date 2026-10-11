import { expect, jest, test } from "@jest/globals";
import { attachCanvasPan } from "../../src/frontend/canvas-radar-pan.mjs";

test("pans with mouse and ignores touch drag", () => {
  const listeners = new Map();
  const canvas = {
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: jest.fn(),
    setPointerCapture: jest.fn(),
  };
  const onPan = jest.fn();
  const detach = attachCanvasPan(canvas, onPan);
  const event = (pointerType, pointerId, clientX, clientY) => ({
    pointerType,
    pointerId,
    clientX,
    clientY,
  });
  listeners.get("pointermove")(event("mouse", 1, 5, 5));
  listeners.get("pointerdown")(event("mouse", 1, 10, 10));
  listeners.get("pointermove")(event("mouse", 1, 20, 35));
  expect(onPan).toHaveBeenCalledWith(10, 25);
  expect(canvas.setPointerCapture).toHaveBeenCalledWith(1);
  listeners.get("pointerup")(event("mouse", 1, 20, 35));
  listeners.get("pointerdown")(event("touch", 2, 0, 0));
  listeners.get("pointermove")(event("touch", 2, 30, 30));
  expect(onPan).toHaveBeenCalledTimes(1);
  detach();
  expect(canvas.removeEventListener).toHaveBeenCalledTimes(4);
});
