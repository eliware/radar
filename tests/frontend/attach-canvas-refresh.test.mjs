import { expect, jest, test } from "@jest/globals";
import { attachCanvasRefresh } from "../../src/frontend/attach-canvas-refresh.mjs";

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
