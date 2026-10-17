import { expect, jest, test } from "@jest/globals";
import { drawProcedures } from "../../src/frontend/draw-procedures.mjs";

function context() {
  return Object.fromEntries(
    [
      "save",
      "restore",
      "beginPath",
      "moveTo",
      "lineTo",
      "closePath",
      "stroke",
      "fillText",
      "clip",
      "setLineDash",
    ].map((name) => [name, jest.fn()]),
  );
}

const point = (fix, x, rangeNm, label = false) => ({
  fix,
  x,
  y: x,
  rangeNm,
  label,
  latitude: 43,
  longitude: -70,
});

test("draws separate SID and STAR paths, hollow fix symbols, and selected labels", () => {
  const ctx = context();
  const project = (item) => ({ x: item.x, y: item.y });
  drawProcedures(
    ctx,
    new Map([
      ["sid", { type: "SID", points: [point("A", 1, 2), point("LBSTA", 2, 2, true)] }],
      ["star", { type: "STAR", points: [point("ENE", 3, 2, true), point("OOSHN", 4, 2)] }],
      ["other", { type: "OTHER", points: [point("X", 5, 2), point("Y", 6, 2)] }],
    ]),
    project,
    10,
  );
  expect(ctx.stroke).toHaveBeenCalledTimes(9);
  expect(ctx.fillText.mock.calls.map(([text]) => text)).toEqual(["LBSTA", "ENE"]);
  expect(ctx.closePath).toHaveBeenCalledTimes(6);
  expect(ctx.save).toHaveBeenCalledTimes(1);
  expect(ctx.restore).toHaveBeenCalledTimes(1);
  expect(ctx.setLineDash).toHaveBeenNthCalledWith(1, [3, 3]);
  expect(ctx.setLineDash).toHaveBeenLastCalledWith([]);
});

test("skips hidden, distant, and invalid points and segments", () => {
  const ctx = context();
  const records = new Map([
    ["path", { type: "STAR", points: [point("FAR", 1, 11, true), point("BAD", 2, 2, true)] }],
    ["outside", { type: "SID", points: [point("A", 3, 12), point("B", 4, 11)] }],
  ]);
  drawProcedures(ctx, records, () => null, 10, false);
  expect(ctx.save).not.toHaveBeenCalled();
  drawProcedures(
    ctx,
    records,
    (item) => (item.fix === "BAD" ? null : { x: item.x, y: item.y }),
    10,
  );
  expect(ctx.stroke).not.toHaveBeenCalled();
  expect(ctx.fillText).not.toHaveBeenCalled();
});

test("keeps STAR routes in their existing color", () => {
  const ctx = context();
  drawProcedures(
    ctx,
    new Map([["star", { type: "STAR", points: [point("A", 1, 2), point("B", 2, 2)] }]]),
    (item) => ({ x: item.x, y: item.y }),
    10,
  );
  expect(ctx.strokeStyle).toBe("#50402e");
});
