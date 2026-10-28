import { expect, jest, test } from "@jest/globals";
import { drawAirportRunways } from "../../../../src/frontend/draw/airport/runways.mjs";

test("skips distant airports and unprojectable runway segments", () => {
  const context = {
    beginPath: jest.fn(),
    lineTo: jest.fn(),
    moveTo: jest.fn(),
    setLineDash: jest.fn(),
    stroke: jest.fn(),
  };
  const runway = [
    { latitude: 43, longitude: -70, elevationFeet: 50, alignmentDegrees: 10 },
    { latitude: 43.01, longitude: -70, elevationFeet: 50, alignmentDegrees: 190 },
  ];
  drawAirportRunways(
    context,
    new Map([
      ["FAR", { rangeNm: 301, runways: [runway] }],
      ["EMPTY", { rangeNm: 1 }],
      ["BAD", { rangeNm: 1, runways: [runway] }],
    ]),
    (point) => (point.latitude === 43 ? null : { x: point.longitude, y: point.latitude }),
  );
  expect(context.stroke).not.toHaveBeenCalled();
});

test("can hide runway segments and all runway guides", () => {
  const context = {
    beginPath: jest.fn(),
    lineTo: jest.fn(),
    moveTo: jest.fn(),
    setLineDash: jest.fn(),
    stroke: jest.fn(),
  };
  const runway = [
    { latitude: 43, longitude: -70, alignmentDegrees: 10 },
    { latitude: 43.01, longitude: -70, alignmentDegrees: 190 },
  ];
  drawAirportRunways(
    context,
    new Map([["PWM", { rangeNm: 1, runways: [runway] }]]),
    (point) => ({ x: point.longitude, y: point.latitude }),
    false,
    false,
    false,
  );
  expect(context.stroke).not.toHaveBeenCalled();
});

test("coordinates runway segments and guides for visible airports", () => {
  const dashPatterns = [];
  const context = {
    beginPath: jest.fn(),
    lineTo: jest.fn(),
    moveTo: jest.fn(),
    setLineDash: (pattern) => dashPatterns.push(pattern),
    stroke: jest.fn(),
  };
  const runway = [
    { latitude: 43, longitude: -70, elevationFeet: 50, alignmentDegrees: 10 },
    { latitude: 43.01, longitude: -70, elevationFeet: 50, alignmentDegrees: 190 },
  ];
  drawAirportRunways(context, new Map([["PWM", { rangeNm: 1, runways: [runway] }]]), (point) => ({
    x: point.longitude,
    y: point.latitude,
  }));
  expect(context.stroke).toHaveBeenCalled();
  expect(dashPatterns).toContainEqual([1, 5]);
});
