import { expect, jest, test } from "@jest/globals";
import { attachCanvasRadarEvents } from "../../src/frontend/attach-canvas-radar-events.mjs";

test("attaches radar events and releases timers and listeners", () => {
  const listeners = new Map();
  const canvas = {
    addEventListener: jest.fn((name, callback) => listeners.set(name, callback)),
    removeEventListener: jest.fn(),
  };
  const windowRef = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    setInterval: jest.fn(() => 42),
    clearInterval: jest.fn(),
  };
  const state = { autoZoom: true, range: 20, offsetX: 0, offsetY: 0, rotation: 0 };
  const detach = attachCanvasRadarEvents(
    canvas,
    state,
    jest.fn(),
    {
      prune: jest.fn(() => []),
      distances: jest.fn(() => []),
    },
    { remove: jest.fn() },
    windowRef,
  );
  listeners.get("wheel")({ preventDefault: jest.fn(), deltaY: -1 });
  expect(state.range).toBeLessThan(20);
  detach();
  expect(windowRef.clearInterval).toHaveBeenCalledWith(42);
  expect(canvas.removeEventListener).toHaveBeenCalledTimes(9);
});
