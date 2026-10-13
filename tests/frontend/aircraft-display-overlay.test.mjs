import { expect, jest, test } from "@jest/globals";
import { createAircraftDisplayOverlay } from "../../src/frontend/aircraft-display-overlay.mjs";

test("draws projected aircraft and history over the scene, then removes its canvas", () => {
  const measuredFonts = [];
  const context = {
    setTransform: jest.fn(),
    clearRect: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    setLineDash: jest.fn(),
    fillRect: jest.fn(),
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
    arc: jest.fn(),
    fillText: jest.fn(),
  };
  const canvas = { style: {}, getContext: () => context, remove: jest.fn() };
  const container = { clientWidth: 200, clientHeight: 100, appendChild: jest.fn() };
  const windowRef = { devicePixelRatio: 3 };
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
    windowRef,
    documentRef: { createElement: () => canvas },
  });
  const ilsApproaches = new Map([
    [
      "PWM:11",
      {
        latitude: 43.1,
        longitude: -70.1,
        elevationFeet: 76,
        rangeNm: 2,
        magneticCourse: 110,
        magneticVariation: 15,
        magneticVariationHemisphere: "W",
        glideSlopeDegrees: 3,
        runwayEnd: "11",
      },
    ],
  ]);
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
    20,
    true,
    new Map([
      ["PWM", { faaId: "PWM", icao: "KPWM", rangeNm: 2, latitude: 43.1, longitude: -70.1 }],
      ["BAD", { faaId: "BAD", rangeNm: 3, latitude: Number.NaN, longitude: -70 }],
    ]),
    new Map([
      ["ENE", { identifier: "ENE", rangeNm: 3, latitude: 43.2, longitude: -70.2 }],
      ["BAD", { identifier: "BAD", rangeNm: 4, latitude: Number.NaN, longitude: -70 }],
    ]),
    new Map([
      [
        "ZBW",
        {
          type: "ARTCC",
          points: [
            { latitude: 43.3, longitude: -70.3 },
            { latitude: 43.4, longitude: -70.4 },
          ],
        },
      ],
    ]),
    ilsApproaches,
  );
  expect(canvas.width).toBe(400);
  expect(container.appendChild).toHaveBeenCalledWith(canvas);
  expect(context.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);
  expect(context.fillText).toHaveBeenCalled();
  expect(context.fillText).toHaveBeenCalledWith("ILS 11", expect.any(Number), expect.any(Number));
  expect(measuredFonts).toContain("18px monospace");
  container.clientWidth = 0;
  container.clientHeight = 0;
  windowRef.devicePixelRatio = 0;
  overlay.draw(
    new Map([
      ["BAD", { icao: "BAD", latitude: Number.NaN, longitude: 0 }],
      ["NO-TRAIL", { icao: "NO-TRAIL", latitude: 43.1, longitude: -70.1 }],
    ]),
    { get: (icao) => (icao === "NO-TRAIL" ? undefined : []) },
    { latitude: 43, longitude: -70 },
    300,
    {},
    20,
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
