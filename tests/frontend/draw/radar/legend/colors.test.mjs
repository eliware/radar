import { expect, test } from "@jest/globals";
import { resolveRadarLegendColor } from "../../../../../src/frontend/draw/radar/legend/colors.mjs";

test("selects palette and fallback colors for enabled legend entries", () => {
  expect(resolveRadarLegendColor(["line", "AIRCRAFT", "bright"], true, {})).toEqual({
    enabled: true,
    ink: "#00ff41",
  });
  expect(resolveRadarLegendColor(["circle", "AIRPORT", "airport"], true, {})).toEqual({
    enabled: true,
    ink: "#b8b8b8",
  });
});

test("dims disconnected and disabled legend entries", () => {
  expect(resolveRadarLegendColor(["line", "AIRCRAFT", "bright"], false, {})).toEqual({
    enabled: true,
    ink: "#444444",
  });
  expect(
    resolveRadarLegendColor(["circle", "AIRPORT", "airport", "airportVisible"], true, {
      airportVisible: false,
    }),
  ).toEqual({ enabled: false, ink: "#444444" });
});
