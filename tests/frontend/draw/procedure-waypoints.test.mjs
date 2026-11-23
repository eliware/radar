import { expect, jest, test } from "@jest/globals";
import { default as drawProcedureWaypoints } from "../../../src/frontend/draw/procedure-waypoints.mjs";

function context() {
  return Object.fromEntries(
    ["beginPath", "moveTo", "lineTo", "closePath", "stroke", "fillText"].map((name) => [
      name,
      jest.fn(),
    ]),
  );
}

const point = (fix, x, y, { rangeNm = 1, label = false, viewportCut = false } = {}) => ({
  fix,
  rangeNm,
  label,
  viewportCut,
  screen: { x, y },
});

test("draws waypoint pyramids and selected labels", () => {
  const ctx = context();
  drawProcedureWaypoints(ctx, [point("FIXA", 4, 8, { label: true }), point("FIXB", 9, 10)]);
  expect(ctx.moveTo).toHaveBeenCalledWith(4, 5);
  expect(ctx.fillText).toHaveBeenCalledTimes(1);
  expect(ctx.fillText).toHaveBeenCalledWith("FIXA", 4, 2);
});

test("skips clipped, distant, and invalid waypoints", () => {
  const ctx = context();
  drawProcedureWaypoints(ctx, [
    point("CUT", 1, 1, { viewportCut: true }),
    point("FAR", 1, 1, { rangeNm: 301 }),
    point("BAD", NaN, 1),
  ]);
  expect(ctx.stroke).not.toHaveBeenCalled();
  expect(ctx.fillText).not.toHaveBeenCalled();
});
