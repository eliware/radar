import { expect, jest, test } from "@jest/globals";
import { airportAirspaceBands } from "../../../src/frontend/airport-airspace/bands.mjs";
import { airportAirspaceEdges } from "../../../src/frontend/airport-airspace/edges.mjs";
import { drawAirspaceRings } from "../../../src/frontend/draw/airspace-rings.mjs";

test("draws a gray radial outline for flagged airspace", () => {
  const context = {
    setLineDash: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
  };
  const airports = new Map([
    ["PWM", { latitude: 43.6, longitude: -70.3, elevationFeet: 76, classC: "Y", rangeNm: 0 }],
    ["FAR", { classC: "Y", rangeNm: 301 }],
    ["NONE", { latitude: 43, longitude: -70, rangeNm: 1 }],
  ]);
  drawAirspaceRings(context, airports, () => ({ x: 1, y: 2 }));
  expect(context.stroke).toHaveBeenCalledTimes(2);
  expect(context.strokeStyle).toBe("#777777");
});

test("draws only radii exposed by the shared airspace edge calculation", () => {
  const context = {
    setLineDash: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
  };
  const airport = {
    latitude: 43,
    longitude: -70,
    elevationFeet: 100,
    classC: "Y",
    rangeNm: 1,
  };
  const { rings } = airportAirspaceEdges(airportAirspaceBands(airport), airport.elevationFeet);
  const exposedRadii = new Set(rings.map(({ radius }) => radius));
  drawAirspaceRings(context, new Map([["PWM", airport]]), () => ({ x: 0, y: 0 }));
  expect(context.stroke).toHaveBeenCalledTimes(exposedRadii.size);
});

test("stops drawing a ring when its projection is invalid", () => {
  const context = {
    setLineDash: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
  };
  const airports = new Map([["PWM", { latitude: 43, longitude: -70, classD: "Y", rangeNm: 1 }]]);

  drawAirspaceRings(context, airports, () => null);

  expect(context.moveTo).not.toHaveBeenCalled();
  expect(context.stroke).not.toHaveBeenCalled();
});
