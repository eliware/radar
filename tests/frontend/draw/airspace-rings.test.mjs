import { expect, jest, test } from "@jest/globals";
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
    ["FAR", { classC: "Y", rangeNm: 30 }],
    ["NONE", { latitude: 43, longitude: -70, rangeNm: 1 }],
  ]);
  drawAirspaceRings(context, airports, () => ({ x: 1, y: 2 }), 20);
  expect(context.stroke).toHaveBeenCalledTimes(2);
  expect(context.strokeStyle).toBe("#777777");
});

test("stops drawing a ring when its projection is invalid", () => {
  const context = {
    setLineDash: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
  };
  const airports = new Map([
    ["PWM", { latitude: 43, longitude: -70, elevationFeet: 50, classD: "Y", rangeNm: 1 }],
  ]);

  drawAirspaceRings(context, airports, () => null, 10);

  expect(context.moveTo).not.toHaveBeenCalled();
  expect(context.stroke).not.toHaveBeenCalled();
});
