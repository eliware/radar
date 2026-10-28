import { expect, jest, test } from "@jest/globals";
import { drawAircraftTags } from "../../../../src/frontend/draw/aircraft/tags.mjs";

test("places aircraft labels, draws their leader lines, and writes each line", () => {
  const context = {
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    fillText: jest.fn(),
    measureText: (text) => ({ width: text.length * 8 }),
    globalAlpha: 1,
  };
  const aircraft = [{ x: 50, y: 50, receivedAt: 1000, lines: ["ABC", "123C"] }];
  drawAircraftTags(context, aircraft, 12, 200, 100, "#00ff41", 1, 1000);
  expect(context.font).toBe('12px Consolas, "Courier New", monospace');
  expect(context.beginPath).toHaveBeenCalledTimes(1);
  expect(context.lineTo).toHaveBeenCalledTimes(1);
  expect(context.stroke).toHaveBeenCalledTimes(1);
  expect(context.fillText).toHaveBeenCalledWith("ABC", expect.any(Number), expect.any(Number));
  expect(context.fillText).toHaveBeenCalledWith("123C", expect.any(Number), expect.any(Number));
  expect(context.fillStyle).toBe("#00ff41");
});
