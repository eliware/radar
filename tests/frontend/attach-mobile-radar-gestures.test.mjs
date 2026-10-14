import { expect, jest, test } from "@jest/globals";
import { attachMobileRadarGestures } from "../../src/frontend/attach-mobile-radar-gestures.mjs";

function setup(capture = false) {
  const listeners = new Map();
  const element = {
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: jest.fn(),
    ...(capture ? { setPointerCapture: jest.fn() } : {}),
  };
  const onZoom = jest.fn();
  const onRotate = jest.fn();
  const detach = attachMobileRadarGestures(element, { onZoom, onRotate });
  const send = (name, pointerId, x, y, pointerType = "touch") => {
    const event = { pointerId, pointerType, clientX: x, clientY: y, preventDefault: jest.fn() };
    listeners.get(name)(event);
    return event;
  };
  return { element, onZoom, onRotate, detach, send };
}

test("ignores mouse and one-finger moves, then reports pinch and twist", () => {
  const state = setup(true);
  state.send("pointermove", 99, 0, 0);
  state.send("pointerdown", 1, 0, 0, "mouse");
  state.send("pointerdown", 1, 0, 0);
  const oneFingerMove = state.send("pointermove", 1, 10, 10);
  expect(oneFingerMove.preventDefault).toHaveBeenCalled();
  expect(state.onZoom).not.toHaveBeenCalled();
  state.send("pointerup", 1, 10, 10);
  state.send("pointerdown", 1, 0, 0);
  state.send("pointerdown", 2, 100, 0);
  const twist = state.send("pointermove", 2, 0, 100);
  expect(twist.preventDefault).toHaveBeenCalled();
  expect(state.onZoom).toHaveBeenCalledWith(1);
  expect(state.onRotate).toHaveBeenCalledWith(expect.closeTo(Math.PI / 2));
  expect(state.element.setPointerCapture).toHaveBeenCalledTimes(3);
  state.detach();
  expect(state.element.removeEventListener).toHaveBeenCalledTimes(4);
});

test("skips zero-distance gestures and resets after pointer cancellation", () => {
  const state = setup();
  state.send("pointerdown", 1, 0, 0);
  state.send("pointerdown", 2, 0, 0);
  state.send("pointermove", 2, 0, 0);
  expect(state.onZoom).not.toHaveBeenCalled();
  state.send("pointermove", 2, 10, 0);
  state.send("pointermove", 2, 0, 0);
  expect(state.onZoom).not.toHaveBeenCalled();
  state.send("pointercancel", 1, 0, 0);
  state.send("pointerup", 2, 10, 0);
  expect(state.onRotate).not.toHaveBeenCalled();
});

test("normalizes twist angles across north and recalculates after a pointer ends", () => {
  const state = setup();
  state.send("pointerdown", 1, 0, 0);
  state.send("pointerdown", 2, -100, 1.745);
  state.send("pointermove", 2, -100, -1.745);
  expect(state.onRotate).toHaveBeenCalledWith(expect.closeTo(0.0349, 2));
  state.send("pointerup", 1, 0, 0);
  state.send("pointerup", 2, -100, -1.745);
  state.send("pointerdown", 1, 0, 0);
  state.send("pointerdown", 2, -100, -1.745);
  state.send("pointerdown", 3, 100, 100);
  state.send("pointerup", 3, 100, 100);
  state.send("pointermove", 2, -100, 1.745);
  expect(state.onRotate).toHaveBeenLastCalledWith(expect.closeTo(-0.0349, 2));
  state.detach();
});
