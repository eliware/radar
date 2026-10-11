import { expect, jest, test } from "@jest/globals";
import { createAircraftDisplayOverlay } from "../../src/frontend/aircraft-display-overlay.mjs";

test("draws projected aircraft and history over the scene, then removes its canvas", () => {
  const measuredFonts = [];
  const context = {
    setTransform: jest.fn(),
    clearRect: jest.fn(),
    measureText: () => {
      measuredFonts.push(context.font);
      return { width: 20 };
    },
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    closePath: jest.fn(),
    fill: jest.fn(),
    fillText: jest.fn(),
  };
  const canvas = { style: {}, getContext: () => context, remove: jest.fn() };
  const container = { clientWidth: 200, clientHeight: 100, appendChild: jest.fn() };
  class Vector3 {
    constructor(x, y, z) {
      Object.assign(this, { x, y, z });
    }
    project() {
      return this;
    }
  }
  const overlay = createAircraftDisplayOverlay({
    THREE: { Vector3 },
    container,
    windowRef: { devicePixelRatio: 1 },
    documentRef: { createElement: () => canvas },
  });
  overlay.draw(
    new Map([
      [
        "ABC",
        {
          icao: "ABC",
          callsign: "TEST",
          latitude: 43,
          longitude: -70,
          altitudeFeet: 300,
          groundSpeedKnots: 100,
          trackDegrees: 0,
        },
      ],
    ]),
    { get: () => [{ x: 0, y: 0, z: 0 }] },
    { latitude: 43, longitude: -70 },
    300,
    {},
  );
  expect(container.appendChild).toHaveBeenCalledWith(canvas);
  expect(context.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
  expect(context.fillText).toHaveBeenCalled();
  expect(measuredFonts).toContain("18px monospace");
  container.clientWidth = 0;
  container.clientHeight = 0;
  overlay.draw(
    new Map([["BAD", { icao: "BAD", latitude: Number.NaN, longitude: 0 }]]),
    { get: () => [] },
    { latitude: 43, longitude: -70 },
    300,
    {},
  );
  expect(canvas.width).toBe(1);
  overlay.destroy();
  expect(canvas.remove).toHaveBeenCalled();
});

test("rejects a canvas without a 2D context", () => {
  expect(() =>
    createAircraftDisplayOverlay({
      THREE: {},
      container: {},
      windowRef: {},
      documentRef: { createElement: () => ({ style: {}, getContext: () => null }) },
    }),
  ).toThrow("Canvas 2D is unavailable");
});
