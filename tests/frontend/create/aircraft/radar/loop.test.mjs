import { expect, jest, test } from "@jest/globals";
import { createAircraftRadarLoop } from "../../../../../src/frontend/create/aircraft/radar/loop.mjs";

test("starts frame and expiry loops, then stops them", () => {
  const callbacks = [];
  const expiryCallbacks = [];
  const controlListeners = new Map();
  let expired = [{ icao: "ABC123" }];
  const renderer = { render: jest.fn(), setSize: jest.fn() };
  const overlay = { draw: jest.fn() };
  const controls = {
    addEventListener: jest.fn((name, listener) => controlListeners.set(name, listener)),
    removeEventListener: jest.fn(),
  };
  const windowRef = {
    requestAnimationFrame: jest.fn((callback) => {
      callbacks.push(callback);
      return callbacks.length;
    }),
    cancelAnimationFrame: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    setInterval: jest.fn((callback) => {
      expiryCallbacks.push(callback);
      return 5;
    }),
    clearInterval: jest.fn(),
  };
  const stop = createAircraftRadarLoop({
    targets: { items: () => new Map(), localDistances: () => [], prune: () => expired },
    trails: { remove: jest.fn() },
    windowRef,
    controls,
    radarCamera: { setRange: jest.fn(), range: () => 20 },
    isAutoZoom: () => true,
    renderer,
    scene: {},
    camera: { updateProjectionMatrix: jest.fn() },
    container: { clientWidth: 100, clientHeight: 100 },
    overlay,
    location: null,
    elevationFeet: 300,
    isConnected: () => false,
  });
  callbacks[0](0);
  callbacks[1](50);
  controlListeners.get("change")();
  callbacks[2](60);
  callbacks[3](100);
  callbacks[4](160);
  expect(overlay.draw).toHaveBeenCalledTimes(3);
  expiryCallbacks[0]();
  expired = [];
  expiryCallbacks[0]();
  stop();
  expect(controls.addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  expect(controls.removeEventListener).toHaveBeenCalledWith(
    "change",
    controlListeners.get("change"),
  );
  expect(windowRef.cancelAnimationFrame).toHaveBeenCalled();
  expect(windowRef.clearInterval).toHaveBeenCalledWith(5);
});

test("does not change range when expired aircraft cannot change auto zoom", () => {
  const setRange = jest.fn();
  const trails = { remove: jest.fn() };
  let frame;
  const windowRef = {
    requestAnimationFrame: jest.fn((callback) => ((frame = callback), 1)),
    cancelAnimationFrame: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    setInterval: jest.fn((callback) => {
      callback();
      return 7;
    }),
    clearInterval: jest.fn(),
  };
  createAircraftRadarLoop({
    targets: { items: () => new Map(), localDistances: () => [], prune: () => ["ABC123"] },
    trails,
    windowRef,
    radarCamera: { setRange, range: () => 20 },
    isAutoZoom: () => false,
    renderer: { render: jest.fn(), setSize: jest.fn() },
    scene: {},
    camera: { updateProjectionMatrix: jest.fn() },
    container: { clientWidth: 100, clientHeight: 100 },
    overlay: { draw: jest.fn() },
    location: null,
    elevationFeet: 300,
    isConnected: () => false,
  });

  frame();
  expect(trails.remove).toHaveBeenCalledWith(["ABC123"]);
  expect(setRange).not.toHaveBeenCalled();
});
