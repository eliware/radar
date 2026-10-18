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
  expect(context.fillText).toHaveBeenCalledTimes(17);
  expect(context.fillText).toHaveBeenCalledWith("AIRCRAFT", 26, 218);
  expect(context.fillText).toHaveBeenCalledWith("A AIRPORT", 26, 282);
  expect(context.fillText).toHaveBeenCalledWith("N VOR", 26, 298);
  expect(context.fillText).toHaveBeenCalledWith("I ILS", 26, 346);
  expect(context.fillText).toHaveBeenCalledWith("V VICTOR", 138, 282);
  expect(context.fillText).toHaveBeenCalledWith("R RUNWAY", 26, 314);
  expect(context.fillText).toHaveBeenCalledWith("E ERCL", 26, 330);
  expect(context.fillText).toHaveBeenCalledWith("M METAR", 138, 314);
  expect(context.fillText).toHaveBeenCalledWith("F FLT STRIPS", 138, 330);
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
  expect(context.fillText).toHaveBeenCalledWith("W WATER", 26, 314);
  expect(context.strokeStyle).toBe("#444444");
});

test("uses a safe column width when text measurement is unavailable", () => {
  const context = createContext();
  delete context.measureText;
  drawRadarLegendTable(context, 800, 400, true, {});
  expect(context.fillText).toHaveBeenCalledWith("R RUNWAY", 26, 314);
});

test("restores METAR and flight-strip indicators from local storage", () => {
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const values = new Map([
    ["radar.visibility.metar", "false"],
    ["radar.visibility.flightStrips", "false"],
  ]);
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: { getItem: (key) => values.get(key) ?? null },
  });
  try {
    const context = createContext();
    const colors = new Map();
    context.fillText.mockImplementation(function (label) {
      colors.set(label, this.fillStyle);
    });
    drawRadarLegendTable(context, 800, 400, true, {});
    expect(colors.get("M METAR")).toBe("#444444");
    expect(colors.get("F FLT STRIPS")).toBe("#444444");
  } finally {
    if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
    else delete globalThis.localStorage;
  }
});
