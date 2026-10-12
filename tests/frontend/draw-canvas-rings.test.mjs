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
  };
  drawCanvasRings(context, 0, 0, 100, 20, { major: "major", minor: "minor", bright: "bright" });
  expect(context.arc).toHaveBeenCalledTimes(4);
  expect(context.fillText).toHaveBeenCalledWith("20", expect.any(Number), expect.any(Number));
});
