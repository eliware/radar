import { expect, test } from "@jest/globals";
import { getRadarLegendVisibility } from "../../../../../src/frontend/draw/radar/legend/visibility.mjs";

test("resolves aircraft and layer visibility from the supplied state", () => {
  expect(getRadarLegendVisibility("aircraftVisible", { aircraftVisible: false })).toBe(true);
  expect(getRadarLegendVisibility("airportVisible", { airportVisible: false })).toBe(false);
  expect(getRadarLegendVisibility("waterVisible", { waterVisible: true })).toBe(true);
});

test("reads METAR and flight-strip visibility from browser storage", () => {
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
    expect(getRadarLegendVisibility("metarVisible", {})).toBe(false);
    expect(getRadarLegendVisibility("flightStripsVisible", {})).toBe(false);
  } finally {
    if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
    else delete globalThis.localStorage;
  }
});

test("defaults stored visibility to enabled when browser storage is unavailable", () => {
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get() {
      throw new Error("storage unavailable");
    },
  });
  try {
    expect(getRadarLegendVisibility("metarVisible", {})).toBe(true);
  } finally {
    if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
    else delete globalThis.localStorage;
  }
});
