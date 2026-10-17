import { expect, jest, test } from "@jest/globals";
import { drawArtccBoundaries } from "../../../src/frontend/draw/artcc-boundaries.mjs";

test("draws ordered ARTCC vertices in gray", () => {
  const context = {
    save: jest.fn(),
    restore: jest.fn(),
    setLineDash: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
  };
  const boundaries = new Map([["ZBW:LOW", { type: "ARTCC", points: [{ x: 1 }, { x: 2 }] }]]);
  drawArtccBoundaries(context, boundaries, (point) => ({ x: point.x, y: 3 }));
  expect(context.strokeStyle).toBe("#777777");
  expect(context.moveTo).toHaveBeenCalledWith(1, 3);
  expect(context.lineTo).toHaveBeenCalledWith(2, 3);
});

test("skips other boundary types and invalid projected points", () => {
  const context = {
    save: jest.fn(),
    restore: jest.fn(),
    setLineDash: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
  };
  const boundaries = new Map([
    ["other", { type: "FIR", points: [{ x: 1 }, { x: 2 }] }],
    ["invalid", { type: "ARTCC", points: [{ x: 1 }, { x: 2 }] }],
  ]);
  drawArtccBoundaries(context, boundaries, (point) =>
    point.x === 1 ? { x: 1, y: 2 } : { x: Number.NaN, y: 2 },
  );
  expect(context.stroke).not.toHaveBeenCalled();
  expect(context.restore).toHaveBeenCalledTimes(1);
});
