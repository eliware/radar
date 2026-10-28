import { expect, jest, test } from "@jest/globals";
import { drawAirportRunways } from "../../../../src/frontend/draw/airport/runways.mjs";

test("skips airports outside range and runways with invalid projected ends", () => {
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
    (point) => (point.latitude === 43 ? null : { x: 1, y: 2 }),
  );
  expect(context.stroke).not.toHaveBeenCalled();
});

test("uses zero feet when both NASR and airport elevations are missing", () => {
  const elevations = [];
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
    new Map([["UNKNOWN", { rangeNm: 1, runways: [runway] }]]),
    (point) => {
      elevations.push(point.elevationFeet);
      return { x: point.longitude, y: point.latitude };
    },
  );
  expect(elevations).toContain(0);
  expect(elevations).toContain(3000);
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
