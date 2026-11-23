import { expect, jest, test } from "@jest/globals";
import { default as drawRadarScaleLegend } from "../../../../../src/frontend/draw/radar/legend/draw-scale-legend.mjs";

function context() {
  const value = Object.fromEntries(
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
  value.measureText = (text) => ({ width: text.length * 7 });
  return value;
}

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

test("adapts visibility options to wide and narrow layouts", () => {
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
  const disconnected = context();
  const colors = new Map();
  disconnected.fillText.mockImplementation(function (label) {
    colors.set(label, this.fillStyle);
  });
  drawRadarScaleLegend(disconnected, 400, 400, false, false, false, false);
  expect(colors.get("W WATER")).toBe("#444444");
  const connected = context();
  const connectedColors = new Map();
  connected.fillText.mockImplementation(function (label) {
    connectedColors.set(label, this.fillStyle);
  });
  drawRadarScaleLegend(connected, 800, 400, true);
  expect(connectedColors.get("AIRCRAFT")).toBe("#00ff41");
});
