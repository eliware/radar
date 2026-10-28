import { expect, jest, test } from "@jest/globals";
import { drawAircraftTagLabel } from "../../../../src/frontend/draw/aircraft/tag-label.mjs";

test("draws a leader line and each aircraft label line", () => {
  const context = {
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    fillText: jest.fn(),
  };
  drawAircraftTagLabel(
    context,
    { x: 10, y: 20, width: 60, height: 30, item: { x: 100, y: 80, lines: ["ABC", "120"] } },
    12,
  );
  expect(context.beginPath).toHaveBeenCalledTimes(1);
  expect(context.moveTo).toHaveBeenCalledTimes(1);
  expect(context.lineTo).toHaveBeenCalledTimes(1);
  expect(context.stroke).toHaveBeenCalledTimes(1);
  expect(context.fillText).toHaveBeenNthCalledWith(1, "ABC", 17, 32);
  expect(context.fillText).toHaveBeenNthCalledWith(2, "120", 17, 45.8);
});
