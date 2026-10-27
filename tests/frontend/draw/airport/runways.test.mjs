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

test("draws valid base legs when an extension endpoint is invalid", () => {
  const context = {
    beginPath: jest.fn(),
    lineTo: jest.fn(),
    moveTo: jest.fn(),
    setLineDash: jest.fn(),
    stroke: jest.fn(),
  };
  let calls = 0;
  const runway = [
    { latitude: 43, longitude: -70, elevationFeet: 50, alignmentDegrees: 10 },
    { latitude: 43.01, longitude: -70, elevationFeet: 50, alignmentDegrees: 190 },
  ];
  drawAirportRunways(context, new Map([["PWM", { rangeNm: 1, runways: [runway] }]]), () =>
    ++calls <= 2 || calls > 4 ? { x: 1, y: 2 } : null,
  );
  expect(context.stroke).toHaveBeenCalledTimes(4);
});

test("skips guides when all projected guide endpoints are invalid", () => {
  const context = {
    beginPath: jest.fn(),
    lineTo: jest.fn(),
    moveTo: jest.fn(),
    setLineDash: jest.fn(),
    stroke: jest.fn(),
  };
  let calls = 0;
  const runway = [
    { latitude: 43, longitude: -70, elevationFeet: 50, alignmentDegrees: 10 },
    { latitude: 43.01, longitude: -70, elevationFeet: 50, alignmentDegrees: 190 },
  ];
  drawAirportRunways(context, new Map([["PWM", { rangeNm: 1, runways: [runway] }]]), () =>
    ++calls <= 2 ? { x: 1, y: 2 } : null,
  );
  expect(context.stroke).toHaveBeenCalledTimes(1);
});

test("draws extensions when a projected base-leg endpoint is invalid", () => {
  const context = {
    beginPath: jest.fn(),
    lineTo: jest.fn(),
    moveTo: jest.fn(),
    setLineDash: jest.fn(),
    stroke: jest.fn(),
  };
  let calls = 0;
  const runway = [
    { latitude: 43, longitude: -70, elevationFeet: 50, alignmentDegrees: 10 },
    { latitude: 43.01, longitude: -70, elevationFeet: 50, alignmentDegrees: 190 },
  ];
  drawAirportRunways(context, new Map([["PWM", { rangeNm: 1, runways: [runway] }]]), () =>
    ++calls === 5 ? null : { x: 1, y: 2 },
  );
  expect(context.stroke).toHaveBeenCalledTimes(4);
});

test("can toggle runways, ERCL, and base legs independently", () => {
  const runway = [
    { latitude: 43, longitude: -70, elevationFeet: 50, alignmentDegrees: 10 },
    { latitude: 43.01, longitude: -70, elevationFeet: 50, alignmentDegrees: 190 },
  ];
  const makeContext = () => ({
    beginPath: jest.fn(),
    lineTo: jest.fn(),
    moveTo: jest.fn(),
    setLineDash: jest.fn(),
    stroke: jest.fn(),
  });
  const airports = new Map([["PWM", { rangeNm: 1, runways: [runway] }]]);
  const project = (point) => ({ x: point.longitude, y: point.latitude });
  const noRunways = makeContext();
  drawAirportRunways(noRunways, airports, project, false, true);
  expect(noRunways.stroke).toHaveBeenCalledTimes(4);
  const noExtensions = makeContext();
  drawAirportRunways(noExtensions, airports, project, true, false);
  expect(noExtensions.stroke).toHaveBeenCalledTimes(3);
  const noBaseLegs = makeContext();
  drawAirportRunways(noBaseLegs, airports, project, true, true, false);
  expect(noBaseLegs.stroke).toHaveBeenCalledTimes(3);
  const neitherGuide = makeContext();
  drawAirportRunways(neitherGuide, airports, project, true, false, false);
  expect(neitherGuide.stroke).toHaveBeenCalledTimes(1);
});
