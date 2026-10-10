import { expect, jest, test } from "@jest/globals";
import { createCanvasRadarView } from "../../src/frontend/canvas-radar-view.mjs";

function setup(context = makeContext()) {
  const listeners = new Map();
  const canvas = {
    clientWidth: 200,
    clientHeight: 200,
    style: {},
    setAttribute: jest.fn(),
    getContext: jest.fn(() => context),
    setPointerCapture: jest.fn(),
    addEventListener: jest.fn((name, fn) => listeners.set(name, fn)),
    removeEventListener: jest.fn(),
  };
  const container = { replaceChildren: jest.fn() };
  const windowRef = {
    devicePixelRatio: 3,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
  const documentRef = { createElement: jest.fn(() => canvas) };
  return { context, canvas, container, windowRef, documentRef, listeners };
}

function makeContext() {
  return Object.fromEntries(
    [
      "setTransform",
      "fillRect",
      "beginPath",
      "arc",
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
}

test("draws the 2D radar, updates aircraft, handles input, and cleans up", () => {
  const state = setup();
  const location = { latitude: 43, longitude: -70 };
  const view = createCanvasRadarView({ ...state, location });
  expect(view.mode).toBe("2D");
  expect(state.canvas.width).toBe(400);
  state.windowRef.addEventListener.mock.calls[0][1]();
  expect(state.context.arc).toHaveBeenCalledTimes(26);
  const fills = state.context.fillRect.mock.calls.length;
  expect(view.update({ icao: "BAD", latitude: undefined, longitude: 0 })).toBeUndefined();
  expect(state.context.fillRect).toHaveBeenCalledTimes(fills);
  view.update({
    icao: "ABC123",
    callsign: "TEST1",
    latitude: 43.1,
    longitude: -70,
    trackDegrees: 90,
  });
  expect(state.context.rotate).toHaveBeenCalledWith(Math.PI / 2);
  expect(state.context.fillText).toHaveBeenCalledWith(
    "TEST1",
    expect.any(Number),
    expect.any(Number),
  );
  state.listeners.get("pointerdown")({ clientX: 10, clientY: 10, pointerId: 1 });
  state.listeners.get("pointermove")({ clientX: 20, clientY: 30 });
  expect(state.canvas.setPointerCapture).toHaveBeenCalledWith(1);
  state.listeners.get("pointerup")({ pointerId: 1 });
  state.listeners.get("pointermove")({ clientX: 30, clientY: 40 });
  const preventDefault = jest.fn();
  state.listeners.get("wheel")({ deltaY: -1, preventDefault });
  state.listeners.get("wheel")({ deltaY: 1, preventDefault });
  expect(preventDefault).toHaveBeenCalled();
  const touch = (pointerId, clientX, clientY) => ({
    pointerId,
    pointerType: "touch",
    clientX,
    clientY,
    preventDefault: jest.fn(),
  });
  state.listeners.get("pointerdown")(touch(2, 0, 0));
  state.listeners.get("pointermove")(touch(2, 30, 0));
  expect(state.context.translate).not.toHaveBeenCalledWith(30, 0);
  const secondState = setup();
  secondState.canvas.setPointerCapture = undefined;
  const secondView = createCanvasRadarView({ ...secondState, location });
  secondState.listeners.get("pointerdown")({
    clientX: 1,
    clientY: 1,
    pointerId: 4,
    pointerType: "mouse",
  });
  secondView.destroy();
  view.reset();
  view.destroy();
  expect(state.canvas.removeEventListener).toHaveBeenCalledTimes(9);
  expect(state.windowRef.removeEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
  expect(state.container.replaceChildren).toHaveBeenLastCalledWith();
});

test("reports an error when the browser has no 2D canvas", () => {
  const state = setup(null);
  expect(() => createCanvasRadarView({ ...state, location: null })).toThrow(
    "Canvas 2D is unavailable",
  );
});

test("uses the browser globals when callers omit them", () => {
  const state = setup();
  globalThis.window = state.windowRef;
  globalThis.document = state.documentRef;
  const view = createCanvasRadarView({ container: state.container, location: null });
  view.destroy();
  delete globalThis.window;
  delete globalThis.document;
});
