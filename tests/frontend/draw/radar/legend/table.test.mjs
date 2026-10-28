import { expect, jest, test } from "@jest/globals";
import { drawRadarLegendTable } from "../../../../../src/frontend/draw/radar/legend/table.mjs";

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

test("composes aligned legend entries in two columns", () => {
  const context = createContext();
  drawRadarLegendTable(context, 800, 400, true, {
    ilsVisible: true,
    sidVisible: true,
    starVisible: true,
    airwayQVisible: true,
    airwayJVisible: true,
    airwayVVisible: true,
    runwaysVisible: true,
    extensionsVisible: true,
    baseLegsVisible: true,
    airportVisible: true,
    navaidsVisible: true,
    waterVisible: true,
  });
  expect(context.fillText).toHaveBeenCalledTimes(18);
  expect(context.fillText).toHaveBeenCalledWith("AIRCRAFT", 26, 24);
  expect(context.fillText).toHaveBeenCalledWith("60s VECTOR", 26, 40);
  expect(context.fillText).toHaveBeenCalledWith("I ILS", 138, 24);
  expect(context.fillText).toHaveBeenCalledWith("F STRIPS", 138, 152);
});

test("uses a safe column width when text measurement is unavailable", () => {
  const context = createContext();
  delete context.measureText;
  drawRadarLegendTable(context, 800, 400, true, {});
  expect(context.fillText).toHaveBeenCalledWith("R RUNWAY", 26, 120);
});
