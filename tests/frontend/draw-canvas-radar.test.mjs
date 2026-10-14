import { expect, jest, test } from "@jest/globals";
import { drawCanvasRadar } from "../../src/frontend/draw-canvas-radar.mjs";

test("draws close range rings below five nautical miles", () => {
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
  const canvas = { clientWidth: 0, clientHeight: 0 };
  drawCanvasRadar(context, canvas, new Map(), null, 3, 0, 0, { devicePixelRatio: 0 });
  expect(canvas.width).toBe(1);
  expect(canvas.height).toBe(1);
  expect(context.arc).toHaveBeenCalledTimes(6);
  expect(context.clip).toHaveBeenCalledTimes(2);
  expect(context.fillText).toHaveBeenCalledWith("3", expect.any(Number), expect.any(Number));
});

test("draws north-up rings, aircraft, and nearby references while disconnected", () => {
  const context = Object.fromEntries(
    [
      "setTransform",
      "setLineDash",
      "measureText",
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
  context.measureText.mockReturnValue({ width: 8 });
  const home = { latitude: 43, longitude: -70 };
  const canvas = { clientWidth: 300, clientHeight: 200 };
  drawCanvasRadar(
    context,
    canvas,
    new Map([
      [
        "MOVING",
        { icao: "MOVING", latitude: 43.1, longitude: -70, groundSpeedKnots: 90, trackDegrees: 180 },
      ],
      [
        "NORTH",
        {
          icao: "NORTH",
          callsign: "NORTH",
          latitude: 43.05,
          longitude: -70,
          groundSpeedKnots: 100,
          trackDegrees: 0,
        },
      ],
      ["STILL", { icao: "STILL", latitude: 43.2, longitude: -70 }],
      ["BAD", { icao: "BAD", latitude: Number.NaN, longitude: -70 }],
    ]),
    home,
    30,
    5,
    7,
    { devicePixelRatio: 4 },
    0,
    new Map([["MOVING", [{ x: 0, y: 0, z: 0 }]]]),
    false,
    new Map([
      [
        "PWM",
        {
          faaId: "PWM",
          icao: "KPWM",
          rangeNm: 5,
          elevationFeet: 50,
          latitude: 43.3,
          longitude: -70,
        },
      ],
      ["BAD", { faaId: "BAD", rangeNm: 6, elevationFeet: 0, latitude: Number.NaN, longitude: -70 }],
    ]),
    new Map([
      [
        "ENE",
        { identifier: "ENE", rangeNm: 6, elevationFeet: 100, latitude: 43.4, longitude: -70 },
      ],
      [
        "BAD",
        { identifier: "BAD", rangeNm: 7, elevationFeet: 0, latitude: 43, longitude: Number.NaN },
      ],
    ]),
    new Map([
      [
        "ZBW",
        {
          type: "ARTCC",
          points: [
            { latitude: 43.5, longitude: -70 },
            { latitude: 43.6, longitude: -70 },
          ],
        },
      ],
      ["BAD", { type: "ARTCC", points: [{ latitude: Number.NaN, longitude: -70 }] }],
      ["FIR", { type: "FIR", points: [{ latitude: 43, longitude: -70 }] }],
    ]),
  );

  expect(canvas.width).toBe(600);
  expect(canvas.height).toBe(400);
  expect(context.fillStyle).toBe("#50402e");
  expect(context.rotate).toHaveBeenCalledWith(0);
  expect(context.fillText).toHaveBeenCalledWith("NORTH", expect.any(Number), expect.any(Number));
  expect(context.fillText).toHaveBeenCalledWith("KPWM", expect.any(Number), expect.any(Number));
  expect(context.fillText).toHaveBeenCalledWith("ENE", expect.any(Number), expect.any(Number));
});
