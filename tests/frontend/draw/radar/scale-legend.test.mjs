import { expect, jest, test } from "@jest/globals";
import { drawRadarScaleLegend } from "../../../../src/frontend/draw/radar/scale-legend.mjs";

function createContext() {
  return {
    ...Object.fromEntries(
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
    ),
    measureText: jest.fn((text) => ({ width: text.length * 7 })),
  };
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
      "A AIRPORT",
      "N VOR",
      "R RUNWAY",
      "E ERCL",
      "I ILS",
      "D SID",
      "S STAR",
      "W WATER",
      "M METAR",
      "F FLT STRIPS",
    ]),
  );
  expect(context.fillRect).toBeUndefined();
  expect(context.fillText).toHaveBeenCalledWith("AIRCRAFT", 26, 898);
  expect(context.fillText).toHaveBeenCalledWith("R RUNWAY", 26, 994);
  expect(context.closePath).toHaveBeenCalled();
  expect(context.fill).toHaveBeenCalled();
});

test("uses one column and dims hidden layers on narrow views", () => {
  const context = createContext();
  const colors = new Map();
  context.fillText.mockImplementation(function (label) {
    colors.set(label, this.strokeStyle);
  });
  drawRadarScaleLegend(context, 320, 320, 1, 140.8, true, false, false, false);
  expect(context.fillText).toHaveBeenCalledWith("I ILS", 26, 138);
  expect(context.fillText).toHaveBeenCalledWith("W WATER", 26, 234);
  expect(colors.get("I ILS")).toBe("#444444");
});
