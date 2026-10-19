import { expect, jest, test } from "@jest/globals";
import { attachCanvasRadarEvents } from "../../../../src/frontend/attach/canvas/radar-events.mjs";

test("wires pan, zoom, expiry, refresh, and cleanup to the Canvas view", () => {
  const listeners = new Map();
  const canvas = {
    addEventListener: jest.fn((name, listener) =>
      listeners.set(name, [...(listeners.get(name) ?? []), listener]),
    ),
    removeEventListener: jest.fn(),
  };
  let tick;
  const clearInterval = jest.fn();
  const windowRef = {
    setInterval: jest.fn((callback) => {
      tick = callback;
      return 8;
    }),
    clearInterval,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
  const state = { autoZoom: true, offsetX: 0, offsetY: 0, range: 20 };
  const targets = {
    prune: jest
      .fn()
      .mockReturnValueOnce([])
      .mockReturnValueOnce(["OLD"])
      .mockReturnValue(["STALE"]),
    localDistances: jest.fn(() => [50]),
  };
  const trails = { remove: jest.fn() };
  const draw = jest.fn();
  const send = (name, event) => listeners.get(name).forEach((listener) => listener(event));
  const detach = attachCanvasRadarEvents(canvas, state, draw, targets, trails, windowRef);

  send("pointerdown", { pointerType: "mouse", pointerId: 1, clientX: 1, clientY: 2 });
  send("pointermove", { pointerType: "mouse", pointerId: 1, clientX: 11, clientY: 22 });
  expect(state).toMatchObject({ autoZoom: false, offsetX: 10, offsetY: 20 });
  send("wheel", { deltaY: 1, preventDefault: jest.fn() });
  expect(state.range).toBe(24);
  send("wheel", { deltaY: -1, preventDefault: jest.fn() });
  expect(state.range).toBe(20);
  tick();
  state.autoZoom = true;
  tick();
  expect(state.range).toBe(55);
  state.autoZoom = false;
  state.range = 23;
  tick();
  expect(state.range).toBe(23);
  expect(trails.remove.mock.calls).toEqual([[["OLD"]], [["STALE"]]]);
  detach();
  expect(clearInterval).toHaveBeenCalledWith(8);
  expect(canvas.removeEventListener).toHaveBeenCalledTimes(9);
});
