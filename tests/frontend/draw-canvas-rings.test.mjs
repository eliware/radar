import { expect, jest, test } from "@jest/globals";
import { drawCanvasRings } from "../../src/frontend/draw-canvas-rings.mjs";

test("draws range rings and the north-east axes", () => {
  const context = {
    beginPath: jest.fn(),
    arc: jest.fn(),
    stroke: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    fillText: jest.fn(),
    save: jest.fn(),
    translate: jest.fn(),
    rotate: jest.fn(),
    restore: jest.fn(),
  };
  drawCanvasRings(context, 0, 0, 100, 20, { major: "major", minor: "minor", bright: "bright" });
  expect(context.arc).toHaveBeenCalledTimes(4);
  expect(context.fillText).toHaveBeenCalledWith("20", expect.any(Number), expect.any(Number));
});

test("counter-rotates range labels so they stay upright", () => {
  const context = {
    beginPath: jest.fn(),
    arc: jest.fn(),
    stroke: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    fillText: jest.fn(),
    save: jest.fn(),
    translate: jest.fn(),
    rotate: jest.fn(),
    restore: jest.fn(),
  };
  const rotation = Math.PI / 4;
  drawCanvasRings(
    context,
    0,
    0,
    100,
    20,
    { major: "major", minor: "minor", bright: "bright" },
    rotation,
  );
  expect(context.rotate).toHaveBeenCalledWith(-rotation);
  expect(context.fillText).toHaveBeenCalledWith("20", 0, 0);
});
