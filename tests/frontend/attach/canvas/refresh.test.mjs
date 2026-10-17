import { expect, jest, test } from "@jest/globals";
import { attachCanvasRefresh } from "../../../../src/frontend/attach/canvas/refresh.mjs";

test("draws after wheel input and detaches wheel and resize listeners", () => {
  const canvas = { addEventListener: jest.fn(), removeEventListener: jest.fn() };
  const windowRef = { addEventListener: jest.fn(), removeEventListener: jest.fn() };
  const draw = jest.fn();
  const onWheel = jest.fn();
  const detach = attachCanvasRefresh(canvas, windowRef, draw, onWheel);
  const wheel = canvas.addEventListener.mock.calls[0][1];
  const event = { preventDefault: jest.fn(), deltaY: 1 };
  wheel(event);
  expect(event.preventDefault).toHaveBeenCalled();
  expect(onWheel).toHaveBeenCalledWith(event);
  expect(draw).toHaveBeenCalledTimes(1);
  detach();
  expect(canvas.removeEventListener).toHaveBeenCalledWith("wheel", wheel);
  expect(windowRef.removeEventListener).toHaveBeenCalledWith("resize", draw);
});

test("redraws when the canvas resizes without a window resize", () => {
  let onResize;
  const observer = { observe: jest.fn(), disconnect: jest.fn() };
  const canvas = { addEventListener: jest.fn(), removeEventListener: jest.fn() };
  const windowRef = {
    ResizeObserver: jest.fn((callback) => {
      onResize = callback;
      return observer;
    }),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
  const draw = jest.fn();
  const detach = attachCanvasRefresh(canvas, windowRef, draw, jest.fn());

  expect(observer.observe).toHaveBeenCalledWith(canvas);
  onResize();
  expect(draw).toHaveBeenCalledTimes(1);
  detach();
  expect(observer.disconnect).toHaveBeenCalled();
});
