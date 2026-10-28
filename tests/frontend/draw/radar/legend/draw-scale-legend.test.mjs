import { expect, jest, test } from "@jest/globals";
import { drawRadarScaleLegend } from "../../../../../src/frontend/draw/radar/legend/draw-scale-legend.mjs";

test("draws the radar legend from layer visibility defaults", () => {
  const context = Object.fromEntries(
    [
      "beginPath",
      "moveTo",
      "lineTo",
      "stroke",
      "closePath",
      "fill",
      "arc",
      "fillText",
      "setLineDash",
    ].map((name) => [name, jest.fn()]),
  );
  context.measureText = (text) => ({ width: text.length * 7 });
  drawRadarScaleLegend(context, 800, 400);
  expect(context.fillText).toHaveBeenCalledTimes(18);
});
