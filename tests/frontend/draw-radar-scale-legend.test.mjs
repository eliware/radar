import { expect, jest, test } from "@jest/globals";
import { drawRadarScaleLegend } from "../../src/frontend/draw-radar-scale-legend.mjs";

function createContext() {
  return Object.fromEntries(
    [
      "beginPath",
      "moveTo",
      "lineTo",
      "stroke",
      "closePath",
      "fill",
      "arc",
      "fillText",
      "fillRect",
      "setLineDash",
    ].map((name) => [name, jest.fn()]),
  );
}

test("draws the radar legend keys", () => {
  const context = createContext();
  drawRadarScaleLegend(context, 1080, 1080, 20, 475.2);
  expect(context.fillRect).toHaveBeenCalledWith(8, 972, 212, 98);
  expect(context.fillText).toHaveBeenCalledWith("AIRCRAFT", 24, 984);
  expect(context.fillText).toHaveBeenCalledWith("60s VECTOR", 132, 984);
  expect(context.fillText).toHaveBeenCalledWith("HISTORY", 24, 1002);
  expect(context.fillText).toHaveBeenCalledWith("HOME", 112, 1002);
  expect(context.fillText).toHaveBeenCalledWith("I ILS", 32, 1020);
  expect(context.closePath).toHaveBeenCalled();
  expect(context.fill).toHaveBeenCalled();
});

test("marks hidden ILS lines as off in the legend", () => {
  const context = createContext();
  drawRadarScaleLegend(context, 320, 320, 1, 140.8, true, false);
  expect(context.fillText).toHaveBeenCalledWith("I ILS", 32, 260);
  expect(context.strokeStyle).toBe("#444");
});
