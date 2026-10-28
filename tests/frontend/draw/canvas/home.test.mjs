import { expect, jest, test } from "@jest/globals";
import { drawHomeMarker } from "../../../../src/frontend/draw/canvas/home.mjs";

test("draws the home marker at the radar center", () => {
  const context = { beginPath: jest.fn(), arc: jest.fn(), fill: jest.fn() };
  drawHomeMarker(context, 120, 80, "#fff");
  expect(context.fillStyle).toBe("#fff");
  expect(context.beginPath).toHaveBeenCalledTimes(1);
  expect(context.arc).toHaveBeenCalledWith(120, 80, 5, 0, Math.PI * 2);
  expect(context.fill).toHaveBeenCalledTimes(1);
});
