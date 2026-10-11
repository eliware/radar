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
    ].map((name) => [name, jest.fn()]),
  );
}

test("draws a radar legend and a scale that matches the current range", () => {
  const context = createContext();
  drawRadarScaleLegend(context, 1080, 1080, 20, 475.2);
  expect(context.fillRect).toHaveBeenCalledWith(8, 990, 212, 80);
  expect(context.fillText).toHaveBeenCalledWith("AIRCRAFT", 24, 1002);
  expect(context.fillText).toHaveBeenCalledWith("60s VECTOR", 132, 1002);
  expect(context.fillText).toHaveBeenCalledWith("HISTORY", 24, 1020);
  expect(context.fillText).toHaveBeenCalledWith("HOME", 112, 1020);
  expect(context.fillText).toHaveBeenCalledWith("5 NM", 14, 1046);
  expect(context.lineTo).toHaveBeenCalledWith(132.8, 1063);
  expect(context.closePath).toHaveBeenCalled();
  expect(context.fill).toHaveBeenCalled();
});

test("shows one nautical mile when the view is at minimum range", () => {
  const context = createContext();
  drawRadarScaleLegend(context, 320, 320, 1, 140.8);
  expect(context.fillText).toHaveBeenCalledWith("1 NM", 14, 286);
  expect(context.lineTo).toHaveBeenCalledWith(154.8, 303);
});
