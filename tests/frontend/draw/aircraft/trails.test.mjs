import { expect, jest, test } from "@jest/globals";
import { drawAircraftTrails } from "../../../../src/frontend/draw/aircraft/trails.mjs";

test("draws trail marks before each aircraft's current position", () => {
  const context = { fillText: jest.fn() };
  const history = [
    { x: 1, y: 2 },
    { x: 3, y: 4 },
    { x: 5, y: 6 },
  ];
  drawAircraftTrails(context, [{ history }, {}], 12, "#888");
  expect(context.fillStyle).toBe("#888");
  expect(context.font).toBe('6px Consolas, "Courier New", monospace');
  expect(context.fillText).toHaveBeenCalledTimes(2);
  expect(context.fillText).toHaveBeenNthCalledWith(1, String.fromCharCode(92), 1, 2);
  expect(context.fillText).toHaveBeenNthCalledWith(2, String.fromCharCode(92), 3, 4);
});
