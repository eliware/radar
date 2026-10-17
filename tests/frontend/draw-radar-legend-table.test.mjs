import { expect, jest, test } from "@jest/globals";
import { drawRadarLegendTable } from "../../src/frontend/draw-radar-legend-table.mjs";

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

test("draws every aligned legend symbol in two columns", () => {
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
    airportVisible: true,
    navaidsVisible: true,
    waterVisible: true,
  });
  expect(context.fillText).toHaveBeenCalledTimes(15);
  expect(context.fillText).toHaveBeenCalledWith("AIRCRAFT", 26, 234);
  expect(context.fillText).toHaveBeenCalledWith("A AIRPORT", 26, 298);
  expect(context.fillText).toHaveBeenCalledWith("N VOR", 26, 314);
  expect(context.fillText).toHaveBeenCalledWith("I ILS", 118, 234);
  expect(context.fillText).toHaveBeenCalledWith("V VICTOR", 118, 314);
  expect(context.fillText).toHaveBeenCalledWith("R RUNWAY", 26, 330);
  expect(context.fillText).toHaveBeenCalledWith("E ERCL", 26, 346);
  expect(context.stroke).toHaveBeenCalled();
  expect(context.arc).toHaveBeenCalled();
});

test("draws a single column and dims disabled or disconnected entries", () => {
  const context = createContext();
  drawRadarLegendTable(context, 400, 400, false, {
    ilsVisible: false,
    sidVisible: false,
    starVisible: false,
    airwayQVisible: false,
    airwayJVisible: false,
    airwayVVisible: false,
    airportVisible: false,
    navaidsVisible: false,
    runwaysVisible: false,
    extensionsVisible: false,
    waterVisible: false,
  });
  expect(context.fillText).toHaveBeenCalledWith("W WATER", 26, 346);
  expect(context.strokeStyle).toBe("#444444");
});

test("uses a safe column width when text measurement is unavailable", () => {
  const context = createContext();
  delete context.measureText;
  drawRadarLegendTable(context, 800, 400, true, {});
  expect(context.fillText).toHaveBeenCalledWith("R RUNWAY", 26, 330);
});
