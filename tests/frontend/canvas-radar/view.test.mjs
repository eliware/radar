import { expect, jest, test } from "@jest/globals";
import { createCanvasRadarView } from "../../../src/frontend/canvas-radar/view.mjs";

function setup(context = makeContext()) {
  const listeners = new Map();
  const keyListeners = new Map();
  const intervals = [];
  const canvas = {
    clientWidth: 200,
    clientHeight: 200,
    style: {},
    setAttribute: jest.fn(),
    getContext: jest.fn(() => context),
    addEventListener: jest.fn((name, listener) =>
      listeners.set(name, [...(listeners.get(name) ?? []), listener]),
    ),
    removeEventListener: jest.fn(),
  };
  const container = { replaceChildren: jest.fn() };
  const windowRef = {
    devicePixelRatio: 3,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    setInterval: jest.fn((callback) => {
      intervals.push(callback);
      return intervals.length;
    }),
    clearInterval: jest.fn(),
  };
  const documentRef = {
    createElement: jest.fn(() => canvas),
    addEventListener: jest.fn((name, callback) =>
      keyListeners.set(name, [...(keyListeners.get(name) ?? []), callback]),
    ),
    removeEventListener: jest.fn(),
  };
  return {
    context,
    canvas,
    container,
    windowRef,
    documentRef,
    send: (name, event) => listeners.get(name).forEach((listener) => listener(event)),
    sendKey: (event) => keyListeners.get("keydown").forEach((listener) => listener(event)),
    tick: () => intervals.forEach((callback) => callback()),
  };
}

function makeContext() {
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
  context.measureText = jest.fn((text) => ({ width: text.length * 8 }));
  return context;
}

test("wires view changes and reference updates", () => {
  const state = setup();
  const location = { latitude: 43, longitude: -70 };
  const view = createCanvasRadarView({ ...state, location });
  expect(view.mode).toBe("2D");
  expect(view.northAngle()).toBe(0);
  const compassUpdate = jest.fn();
  const detachCompass = view.onViewChange(compassUpdate);
  expect(compassUpdate).toHaveBeenCalledTimes(1);
  expect(view.range()).toBeGreaterThan(0);
  expect(view.getViewportBounds()).toMatchObject({
    minX: expect.any(Number),
    maxRangeNm: expect.any(Number),
  });
  expect(view.visibleRadiusNm()).toBe(view.getViewportBounds().visibleRadiusNm);
  view.updateAirports([{ faaId: "PWM", icao: "KPWM", rangeNm: 4, latitude: 43.1, longitude: -70 }]);
  view.updateNavaids([{ identifier: "ENE", rangeNm: 5, latitude: 43.2, longitude: -70 }]);
  view.updateBoundaries([{ id: "ZBW", type: "ARTCC", points: [{ latitude: 43, longitude: -70 }] }]);
  view.setConnected(true);
  expect(compassUpdate).toHaveBeenCalledTimes(5);
  detachCompass();
  view.setConnected(false);
  expect(view.tilt).toBeUndefined();
  view.reset();
  view.destroy();
  expect(state.canvas.removeEventListener).toHaveBeenCalledTimes(9);
  expect(state.windowRef.removeEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
  expect(state.windowRef.clearInterval).toHaveBeenCalledWith(1);
  expect(state.container.replaceChildren).toHaveBeenLastCalledWith();
});

test("starts with the configured range and rotation", () => {
  const state = setup();
  const view = createCanvasRadarView({
    ...state,
    location: { latitude: 43, longitude: -70 },
    defaultRangeNm: 25,
    defaultRotationDegrees: 140,
  });
  expect(view.range()).toBe(25);
  expect(view.northAngle()).toBeCloseTo((-140 * Math.PI) / 180);
  view.destroy();
});

test("ignores invalid aircraft and draws valid aircraft updates", () => {
  jest.useFakeTimers().setSystemTime(1_000_000);
  try {
    const state = setup();
    const view = createCanvasRadarView({ ...state, location: { latitude: 43, longitude: -70 } });
    const draws = state.context.fillRect.mock.calls.length;
    expect(view.update({ icao: "BAD", latitude: undefined, longitude: 0 })).toBeUndefined();
    expect(state.context.fillRect).toHaveBeenCalledTimes(draws);
    view.update({
      icao: "ABC123",
      callsign: "TEST1",
      latitude: 43.1,
      longitude: -70,
      trackDegrees: 90,
      groundSpeedKnots: 100,
    });
    expect(state.context.fillText).toHaveBeenCalledWith(
      "TEST1",
      expect.any(Number),
      expect.any(Number),
    );
    jest.setSystemTime(1_120_001);
    state.tick();
    expect(state.context.rotate).toHaveBeenCalledWith(0);
    view.destroy();
  } finally {
    jest.useRealTimers();
  }
});

test("keeps a user zoom when new aircraft arrive", () => {
  const state = setup();
  const view = createCanvasRadarView({ ...state, location: { latitude: 43, longitude: -70 } });
  state.send("wheel", { deltaY: 1, preventDefault: jest.fn() });
  view.update({ icao: "ABC123", latitude: 43.1, longitude: -70 });
  expect(view.range()).toBe(24);
  view.destroy();
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

test("redraws the radar when the W key changes water visibility", () => {
  const state = setup();
  const view = createCanvasRadarView({ ...state, location: null });
  const drawCount = state.context.fillRect.mock.calls.length;
  state.sendKey({ key: "w", preventDefault: jest.fn() });
  expect(state.context.fillRect.mock.calls.length).toBeGreaterThan(drawCount);
  view.destroy();
  expect(state.documentRef.removeEventListener).toHaveBeenCalledWith(
    "keydown",
    expect.any(Function),
  );
});

test("syncs layer visibility when a layer shortcut changes its state", () => {
  const state = setup();
  const view = createCanvasRadarView({ ...state, location: null });
  const drawCount = state.context.fillRect.mock.calls.length;
  state.sendKey({ key: "i", preventDefault: jest.fn() });
  expect(state.context.fillRect.mock.calls.length).toBeGreaterThan(drawCount);
  view.destroy();
});
