import { expect, jest, test } from "@jest/globals";
import { default as drawAirwayFixes } from "../../../src/frontend/draw/airway-fixes.mjs";

function context() {
  return Object.fromEntries(
    ["beginPath", "moveTo", "lineTo", "closePath", "stroke", "fillText"].map((name) => [
      name,
      jest.fn(),
    ]),
  );
}

const point = (fix, x, y, rangeNm = 1, viewportCut = false) => ({
  fix,
  rangeNm,
  viewportCut,
  screen: { x, y },
});

test("draws labeled diamond markers for visible airway fixes", () => {
  const ctx = context();
  drawAirwayFixes(ctx, [point("FIXA", 4, 8)]);
  expect(ctx.moveTo).toHaveBeenCalledWith(4, 5);
  expect(ctx.lineTo).toHaveBeenNthCalledWith(1, 7, 8);
  expect(ctx.fillText).toHaveBeenCalledWith("FIXA", 11, 3);
});

test("skips clipped, distant, and invalid airway fixes", () => {
  const ctx = context();
  drawAirwayFixes(ctx, [
    point("CUT", 1, 1, 1, true),
    point("FAR", 1, 1, 301),
    point("BAD", NaN, 1),
  ]);
  expect(ctx.stroke).not.toHaveBeenCalled();
  expect(ctx.fillText).not.toHaveBeenCalled();
});
