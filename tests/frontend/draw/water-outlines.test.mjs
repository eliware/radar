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
    (point) => ({ x: point.x * 100, y: point.z * 100 }),
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
  drawWaterOutlines(
    context,
    [[{ latitude: 1, longitude: 2 }]],
    (point) => ({ x: point.x, y: point.z }),
    { latitude: 1, longitude: 2 },
    100,
    100,
  );
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

test("skips water paths outside the visible canvas", () => {
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
    (point) => ({ x: point.x * 100, y: point.z * 100 }),
    { latitude: 0, longitude: 0 },
    100,
    100,
  );
  expect(context.stroke).not.toHaveBeenCalled();
});

test("reuses projected coordinates and ignores invalid source points", () => {
  const context = Object.fromEntries(
    ["save", "restore", "beginPath", "moveTo", "lineTo", "stroke"].map((key) => [key, jest.fn()]),
  );
  const paths = [
    [
      { latitude: 1, longitude: 2 },
      { latitude: 1.1, longitude: 2.1 },
      { latitude: Number.NaN, longitude: 2 },
    ],
  ];
  const location = { latitude: 1, longitude: 2 };
  const project = (point) => ({ x: point.x, y: point.z });
  drawWaterOutlines(context, paths, project, location);
  drawWaterOutlines(context, paths, project, location);
  expect(context.lineTo).toHaveBeenCalledTimes(2);
  expect(context.stroke).toHaveBeenCalledTimes(2);
});

test("skips subpixel detail in water paths", () => {
  const context = Object.fromEntries(
    ["save", "restore", "beginPath", "moveTo", "lineTo", "stroke"].map((key) => [key, jest.fn()]),
  );
  drawWaterOutlines(
    context,
    [
      [
        { latitude: 1, longitude: 2 },
        { latitude: 1.000001, longitude: 2.000001 },
      ],
    ],
    (point) => ({ x: point.x, y: point.z }),
    { latitude: 1, longitude: 2 },
  );
  expect(context.lineTo).not.toHaveBeenCalled();
});

test("skips water paths outside each side of the canvas", () => {
  for (const [offsetX, offsetY] of [
    [-200, 100],
    [200, 0],
    [50, -200],
    [50, 200],
  ]) {
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
      (point) => ({ x: point.x + offsetX, y: point.z + offsetY }),
      { latitude: 1, longitude: 2 },
      100,
      100,
    );
    expect(context.stroke).not.toHaveBeenCalled();
  }
});

test("ignores unavailable water path data", () => {
  const context = Object.fromEntries(
    ["save", "restore", "beginPath", "moveTo", "lineTo", "stroke"].map((key) => [key, jest.fn()]),
  );
  drawWaterOutlines(context, null, (point) => point, { latitude: 1, longitude: 2 });
  expect(context.stroke).not.toHaveBeenCalled();
});
