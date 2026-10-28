import { expect, jest, test } from "@jest/globals";
import { createRadarLegendState } from "../../../../../src/frontend/draw/radar/legend/state.mjs";
import { drawRadarScaleLegend } from "../../../../../src/frontend/draw/radar/legend/draw-scale-legend.mjs";

function context() {
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

test("adapts scale legend visibility options for wide and narrow layouts", () => {
  const wide = context();
  drawRadarScaleLegend(wide, 1080, 1080);
  expect(wide.fillText).toHaveBeenCalledWith("M METAR", 138, 136);
  expect(wide.fillText).toHaveBeenCalledWith("F STRIPS", 138, 152);

  const narrow = context();
  const colors = new Map();
  narrow.fillText.mockImplementation(function (label) {
    colors.set(label, this.strokeStyle);
  });
  drawRadarScaleLegend(narrow, 320, 320, true, false, false, false);
  expect(narrow.fillText).toHaveBeenCalledWith("I ILS", 26, 150);
  expect(narrow.fillText).toHaveBeenCalledWith("W WATER", 26, 234);
  expect(colors.get("I ILS")).toBe("#444444");
});

test("dims disabled or disconnected entries while preserving aircraft appearance", () => {
  const contextRef = context();
  const colors = new Map();
  contextRef.fillText.mockImplementation(function (label) {
    colors.set(label, this.fillStyle);
  });
  drawRadarScaleLegend(contextRef, 400, 400, false, false, false, false);
  expect(colors.get("W WATER")).toBe("#444444");
  const connected = context();
  const connectedColors = new Map();
  connected.fillText.mockImplementation(function (label) {
    connectedColors.set(label, this.fillStyle);
  });
  drawRadarScaleLegend(connected, 800, 400, true);
  expect(connectedColors.get("AIRCRAFT")).toBe("#00ff41");
});
