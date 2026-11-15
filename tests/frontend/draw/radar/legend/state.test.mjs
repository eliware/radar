import { expect, test } from "@jest/globals";
import { createRadarLegendState } from "../../../../../src/frontend/draw/radar/legend/state.mjs";

test("adapts visibility settings to the legend's layer keys", () => {
  expect(
    createRadarLegendState(
      false,
      false,
      false,
      { Q: false, J: true, V: false },
      { runwaysVisible: false, extensionsVisible: true, baseLegsVisible: false },
      { airportsVisible: true, navaidsVisible: false },
    ),
  ).toEqual({
    ilsVisible: false,
    sidVisible: false,
    starVisible: false,
    airwayQVisible: false,
    airwayJVisible: true,
    airwayVVisible: false,
    runwaysVisible: false,
    extensionsVisible: true,
    baseLegsVisible: false,
    airportVisible: true,
    navaidsVisible: false,
    waterVisible: false,
  });
  expect(
    createRadarLegendState(true, { sidVisible: true, starVisible: false }, true, {}, {}, {}),
  ).toMatchObject({ sidVisible: true, starVisible: false });
});
