import { expect, jest, test } from "@jest/globals";
import { drawAirportMarkers } from "../../src/frontend/draw-airport-markers.mjs";

test("draws a gray identifier for airports inside the current range", () => {
  const context = {
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    fillText: jest.fn(),
    setLineDash: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
  };
  const airports = new Map([
    ["PWM", { faaId: "PWM", icao: "KPWM", rangeNm: 10 }],
    ["BGR", { faaId: "BGR", icao: "KBGR", rangeNm: 40 }],
  ]);
  drawAirportMarkers(context, airports, () => ({ x: 20, y: 30 }), 20);
  expect(context.fillStyle).toBe("#b8b8b8");
  expect(context.textAlign).toBe("center");
  expect(context.fillText).toHaveBeenCalledWith("KPWM", 20, 20);
  expect(context.fillText).toHaveBeenCalledTimes(1);
});

test("draws runway extensions and base legs and skips invalid or distant geometry", () => {
  const strokeColors = [];
  const context = {
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    fillText: jest.fn(),
    setLineDash: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(function () {
      strokeColors.push(this.strokeStyle);
    }),
  };
  const runwayEnds = [
    { latitude: 43, longitude: -70, elevationFeet: 100, alignmentDegrees: 90 },
    { latitude: 43.01, longitude: -70, elevationFeet: 110, alignmentDegrees: 270 },
  ];
  const airports = new Map([
    [
      "PWM",
      {
        faaId: "PWM",
        icao: "KPWM",
        rangeNm: 1,
        elevationFeet: 50,
        latitude: 43,
        longitude: -70,
        runways: [runwayEnds],
      },
    ],
    [
      "BGR",
      {
        faaId: "BGR",
        rangeNm: 2,
        latitude: 45,
        longitude: -70,
        runways: [
          [
            { latitude: 44, longitude: -70, alignmentDegrees: 0 },
            { latitude: 44.01, longitude: -70, alignmentDegrees: 180 },
          ],
        ],
      },
    ],
    [
      "PWM2",
      {
        faaId: "PWM2",
        icao: "KPWM2",
        rangeNm: 3,
        latitude: 45.5,
        longitude: -70,
        runways: [
          [
            { latitude: 46, longitude: -70, alignmentDegrees: 0 },
            { latitude: 46.01, longitude: -70, alignmentDegrees: 180 },
          ],
        ],
      },
    ],
    ["BAD", { faaId: "BAD", rangeNm: 4, latitude: 45.2, longitude: -70 }],
    ["FAR", { faaId: "FAR", icao: "KFAR", rangeNm: 30, runways: runwayEnds }],
  ]);
  const project = (point) => {
    if (point.latitude === 44) return { x: 1, y: Number.NaN };
    if (point.faaId === "BAD") return null;
    if (point.latitude > 45.5 && point.alignmentDegrees === undefined) return null;
    return { x: point.latitude, y: point.longitude };
  };

  drawAirportMarkers(context, airports, project, 10);

  expect(context.fillText).toHaveBeenCalledTimes(3);
  expect(context.fillText).toHaveBeenCalledWith("KPWM", 43, -80);
  expect(context.fillText).toHaveBeenCalledWith("BGR", 45, -80);
  expect(context.fillText).toHaveBeenCalledWith("KPWM2", 45.5, -80);
  expect(context.stroke).toHaveBeenCalledTimes(6);
  expect(strokeColors).toContain("#333333");
  expect(context.strokeStyle).toBe("#b8b8b8");
  expect(context.lineCap).toBe("round");
  expect(context.setLineDash).toHaveBeenCalledWith([1, 5]);
  expect(context.setLineDash.mock.calls.filter(([dash]) => dash[0] === 1)).toHaveLength(2);
  expect(context.moveTo).toHaveBeenCalledWith(43, -70);
  expect(context.restore).toHaveBeenCalledTimes(1);
});
