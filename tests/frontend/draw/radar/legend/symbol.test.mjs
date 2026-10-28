import { expect, jest, test } from "@jest/globals";
import { drawRadarLegendSymbol } from "../../../../../src/frontend/draw/radar/legend/symbol.mjs";

function context() {
  return Object.fromEntries(
    ["beginPath", "moveTo", "lineTo", "stroke", "closePath", "fill", "arc", "setLineDash"].map(
      (name) => [name, jest.fn()],
    ),
  );
}

test("draws the diamond and circle symbols", () => {
  const diamond = context();
  drawRadarLegendSymbol(diamond, "diamond", 10, 20);
  expect(diamond.closePath).toHaveBeenCalledTimes(1);
  expect(diamond.stroke).toHaveBeenCalledTimes(1);
  const circle = context();
  drawRadarLegendSymbol(circle, "circle", 10, 20);
  expect(circle.arc).toHaveBeenCalledWith(10, 20, 2.5, 0, Math.PI * 2);
  expect(circle.fill).toHaveBeenCalledTimes(1);
});

test.each(["cross", "slash", "wave", "dash", "line", "unknown"])(
  "draws the %s line symbol",
  (icon) => {
    const drawing = context();
    drawRadarLegendSymbol(drawing, icon, 10, 20);
    expect(drawing.stroke).toHaveBeenCalledTimes(1);
    expect(drawing.setLineDash).toHaveBeenNthCalledWith(
      1,
      icon === "dash" || icon === "wave" ? [2, 2] : [],
    );
    expect(drawing.setLineDash).toHaveBeenLastCalledWith([]);
  },
);
