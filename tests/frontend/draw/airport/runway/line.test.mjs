import { expect, jest, test } from "@jest/globals";
import { drawRunwayLine } from "../../../../../src/frontend/draw/airport/runway/line.mjs";

test("draws a runway segment between its projected ends", () => {
  const context = {
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
  };
  drawRunwayLine(context, { x: 2, y: 3 }, { x: 8, y: 9 });
  expect(context.beginPath).toHaveBeenCalledTimes(1);
  expect(context.moveTo).toHaveBeenCalledWith(2, 3);
  expect(context.lineTo).toHaveBeenCalledWith(8, 9);
  expect(context.stroke).toHaveBeenCalledTimes(1);
});
