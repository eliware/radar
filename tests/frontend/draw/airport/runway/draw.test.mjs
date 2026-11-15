import { expect, jest, test } from "@jest/globals";
import { drawAirportRunway } from "../../../../../src/frontend/draw/airport/runway/draw.mjs";

const runway = [
  { latitude: 43, longitude: -70, alignmentDegrees: 10 },
  { latitude: 43.01, longitude: -70, alignmentDegrees: 190 },
];

function createContext() {
  return {
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    setLineDash: jest.fn(),
  };
}

test("draws a projected runway with the runway stroke style", () => {
  const context = createContext();
  drawAirportRunway(
    context,
    runway,
    { elevationFeet: 100 },
    (point) => ({ x: point.longitude, y: point.latitude }),
    true,
    false,
    false,
  );
  expect(context.stroke).toHaveBeenCalledTimes(1);
  expect(context.strokeStyle).toBe("#777777");
  expect(context.lineWidth).toBe(1.5);
  expect(context.setLineDash).toHaveBeenCalledWith([]);
});

test("skips invalid projections and draws guides without the runway line", () => {
  const context = createContext();
  drawAirportRunway(context, runway, {}, () => null, true, true, true);
  expect(context.stroke).not.toHaveBeenCalled();
  drawAirportRunway(
    context,
    runway,
    {},
    (point) => ({ x: point.longitude, y: point.latitude }),
    false,
    true,
    false,
  );
  expect(context.stroke).toHaveBeenCalled();
  expect(context.strokeStyle).toBe("#333333");
});
