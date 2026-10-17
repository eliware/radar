import { expect, jest, test } from "@jest/globals";
import { drawWaterOutlines } from "../../../src/frontend/draw/water-outlines.mjs";

test("draws paths as faint gray strokes", () => {
  const context = Object.fromEntries(
    ["save", "restore", "beginPath", "moveTo", "lineTo", "stroke"].map((key) => [key, jest.fn()]),
  );
  drawWaterOutlines(
    context,
    [
      [
        { latitude: 1, longitude: 2 },
        { latitude: 1.1, longitude: 2.1 },
      ],
    ],
    (point) => point,
    { latitude: 1, longitude: 2 },
  );
  expect(context.strokeStyle).toBe("rgba(125, 125, 125, 0.45)");
  expect(context.moveTo).toHaveBeenCalledTimes(1);
  expect(context.lineTo).toHaveBeenCalledTimes(1);
});

test("skips paths with fewer than two valid points", () => {
  const context = Object.fromEntries(
    ["save", "restore", "beginPath", "moveTo", "lineTo", "stroke"].map((key) => [key, jest.fn()]),
  );
  drawWaterOutlines(context, [[{ latitude: 1, longitude: 2 }]], (point) => point, {
    latitude: 1,
    longitude: 2,
  });
  expect(context.stroke).not.toHaveBeenCalled();
});

test("skips points when home coordinates are unavailable", () => {
  const context = Object.fromEntries(
    ["save", "restore", "beginPath", "moveTo", "lineTo", "stroke"].map((key) => [key, jest.fn()]),
  );
  drawWaterOutlines(
    context,
    [
      [
        { latitude: 1, longitude: 2 },
        { latitude: 3, longitude: 4 },
      ],
    ],
    (point) => point,
    null,
  );
  expect(context.stroke).not.toHaveBeenCalled();
});
