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
      "setLineDash",
    ].map((name) => [name, jest.fn()]),
  );
}

test("draws a transparent two-column legend with layer toggles", () => {
  const context = createContext();
  drawRadarScaleLegend(context, 1080, 1080, 20, 475.2);
  const labels = context.fillText.mock.calls.map(([label]) => label);
  expect(labels).toEqual(
    expect.arrayContaining([
      "AIRCRAFT",
      "60s VECTOR",
      "HISTORY",
      "HOME",
      "AIRPORT",
      "VOR",
      "RUNWAY",
      "EXTENSION / BASE",
      "I ILS",
      "S SID",
      "S STAR",
      "W WATER",
    ]),
  );
  expect(context.fillRect).toBeUndefined();
  expect(context.fillText).toHaveBeenCalledWith("AIRCRAFT", 26, 946);
  expect(context.fillText).toHaveBeenCalledWith("RUNWAY", 566, 946);
  expect(context.closePath).toHaveBeenCalled();
  expect(context.fill).toHaveBeenCalled();
});

test("uses one column and dims hidden layers on narrow views", () => {
  const context = createContext();
  drawRadarScaleLegend(context, 320, 320, 1, 140.8, true, false, false, false);
  expect(context.fillText).toHaveBeenCalledWith("I ILS", 26, 218);
  expect(context.fillText).toHaveBeenCalledWith("W WATER", 26, 266);
  expect(context.strokeStyle).toBe("#444444");
});
