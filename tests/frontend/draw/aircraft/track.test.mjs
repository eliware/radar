import { expect, jest, test } from "@jest/globals";
import { drawAircraftTrack } from "../../../../src/frontend/draw/aircraft/track.mjs";

test("draws a future vector and a hollow diamond marker", () => {
  const context = Object.fromEntries(
    ["beginPath", "moveTo", "lineTo", "stroke", "closePath"].map((name) => [name, jest.fn()]),
  );
  drawAircraftTrack(context, { x: 50, y: 50, futureX: 80, futureY: 30 });
  expect(context.moveTo).toHaveBeenNthCalledWith(1, 50, 50);
  expect(context.lineTo).toHaveBeenNthCalledWith(1, 80, 30);
  expect(context.closePath).toHaveBeenCalledTimes(1);
  expect(context.stroke).toHaveBeenCalledTimes(2);
});

test("draws a marker without a vector when prediction coordinates are invalid", () => {
  const context = Object.fromEntries(
    ["beginPath", "moveTo", "lineTo", "stroke", "closePath"].map((name) => [name, jest.fn()]),
  );
  drawAircraftTrack(context, { x: 10, y: 20, futureX: Number.NaN, futureY: 30 });
  expect(context.moveTo).toHaveBeenCalledTimes(1);
  expect(context.lineTo).toHaveBeenCalledTimes(3);
  expect(context.stroke).toHaveBeenCalledTimes(1);
});
