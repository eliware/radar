import { expect, jest, test } from "@jest/globals";
import { drawAirportRunways } from "../../../../src/frontend/draw/airport/runways.mjs";

test("draws endpoint-height runways with rising extensions and level base legs", () => {
  const projected = [];
  const context = {
    beginPath: jest.fn(),
    lineTo: jest.fn(),
    moveTo: jest.fn(),
    setLineDash: jest.fn(),
    stroke: jest.fn(),
  };
  const runway = [
    { runwayId: "09/27", latitude: 43, longitude: -70, elevationFeet: 100, alignmentDegrees: 90 },
    {
      runwayId: "09/27",
      latitude: 43.01,
      longitude: -70,
      elevationFeet: 250,
      alignmentDegrees: 270,
    },
  ];
  const project = (point) => {
    projected.push(point);
    return { x: point.elevationFeet, y: point.latitude };
  };

  drawAirportRunways(
    context,
    new Map([["PWM", { elevationFeet: 75, rangeNm: 1, runways: [runway] }]]),
    project,
    20,
  );

  expect(projected.slice(0, 2).map((point) => point.elevationFeet)).toEqual([100, 250]);
  expect(projected.filter((point) => point.elevationFeet === 3100)).toHaveLength(3);
  expect(projected.filter((point) => point.elevationFeet === 3250)).toHaveLength(3);
  expect(context.stroke).toHaveBeenCalledTimes(5);
});

test("uses airport elevation when a runway end elevation is missing", () => {
  const elevations = [];
  const context = {
    beginPath: jest.fn(),
    lineTo: jest.fn(),
    moveTo: jest.fn(),
    setLineDash: jest.fn(),
    stroke: jest.fn(),
  };
  const runway = [
    { runwayId: "01/19", latitude: 43, longitude: -70, alignmentDegrees: 10 },
    {
      runwayId: "01/19",
      latitude: 43.01,
      longitude: -70,
      elevationFeet: 50,
      alignmentDegrees: 190,
    },
  ];

  drawAirportRunways(
    context,
    new Map([["PWM", { elevationFeet: 80, rangeNm: 1, runways: [runway] }]]),
    (point) => {
      elevations.push(point.elevationFeet);
      return { x: point.longitude, y: point.latitude };
    },
    20,
  );

  expect(elevations.slice(0, 2)).toEqual([80, 50]);
  expect(elevations).toContain(3080);
  expect(elevations).toContain(3050);
});

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
      ["FAR", { rangeNm: 30, runways: [runway] }],
      ["EMPTY", { rangeNm: 1 }],
      ["BAD", { rangeNm: 1, runways: [runway] }],
    ]),
    (point) => (point.latitude === 43 ? null : { x: 1, y: 2 }),
    20,
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
    20,
  );
  expect(elevations).toContain(0);
  expect(elevations).toContain(3000);
});

test("skips an extension when its projected points are invalid", () => {
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
  drawAirportRunways(
    context,
    new Map([["PWM", { rangeNm: 1, runways: [runway] }]]),
    () => (++calls < 3 ? { x: 1, y: 2 } : null),
    20,
  );
  expect(context.stroke).toHaveBeenCalledTimes(1);
});

test("skips base legs when a projected leg endpoint is invalid", () => {
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
  drawAirportRunways(
    context,
    new Map([["PWM", { rangeNm: 1, runways: [runway] }]]),
    () => (++calls === 5 ? null : { x: 1, y: 2 }),
    20,
  );
  expect(context.stroke).toHaveBeenCalledTimes(3);
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
  drawAirportRunways(noRunways, airports, project, 20, false, true);
  expect(noRunways.stroke).toHaveBeenCalledTimes(4);
  const noExtensions = makeContext();
  drawAirportRunways(noExtensions, airports, project, 20, true, false);
  expect(noExtensions.stroke).toHaveBeenCalledTimes(3);
  const noBaseLegs = makeContext();
  drawAirportRunways(noBaseLegs, airports, project, 20, true, true, false);
  expect(noBaseLegs.stroke).toHaveBeenCalledTimes(3);
  const neitherGuide = makeContext();
  drawAirportRunways(neitherGuide, airports, project, 20, true, false, false);
  expect(neitherGuide.stroke).toHaveBeenCalledTimes(1);
});
