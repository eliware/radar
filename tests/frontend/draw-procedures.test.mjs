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
    ]),
    project,
    10,
  );
  expect(ctx.stroke).toHaveBeenCalledTimes(6);
  expect(ctx.fillText.mock.calls.map(([text]) => text)).toEqual(["LBSTA", "ENE"]);
  expect(ctx.closePath).toHaveBeenCalledTimes(4);
  expect(ctx.save).toHaveBeenCalledTimes(1);
  expect(ctx.restore).toHaveBeenCalledTimes(1);
});

test("skips hidden, distant, and invalid points and segments", () => {
  const ctx = context();
  const records = new Map([
    ["path", { type: "STAR", points: [point("FAR", 1, 11, true), point("BAD", 2, 2, true)] }],
  ]);
  drawProcedures(ctx, records, () => null, 10, false);
  expect(ctx.save).not.toHaveBeenCalled();
  drawProcedures(ctx, records, () => null, 10);
  expect(ctx.stroke).not.toHaveBeenCalled();
  expect(ctx.fillText).not.toHaveBeenCalled();
});

test("clips path segments at the range boundary", () => {
  const ctx = context();
  drawProcedures(
    ctx,
    new Map([
      [
        "path",
        { type: "OTHER", points: [point("FAR", 0, 12), point("OUT", 1, 12), point("IN", 2, 8)] },
      ],
    ]),
    (item) => ({ x: item.x, y: item.y }),
    10,
  );
  expect(ctx.moveTo).toHaveBeenCalledWith(1.5, 1.5);
  expect(ctx.lineTo).toHaveBeenCalledWith(2, 2);
  expect(ctx.closePath).toHaveBeenCalledTimes(1);
});

test("clips the end of an in-range segment that leaves the visible range", () => {
  const ctx = context();
  drawProcedures(
    ctx,
    new Map([["path", { type: "SID", points: [point("IN", 0, 8), point("FAR", 2, 12)] }]]),
    (item) => ({ x: item.x, y: item.y }),
    10,
  );
  expect(ctx.lineTo).toHaveBeenCalledWith(1, 1);
});

test("clips procedure paths to the projected radar scope", () => {
  const ctx = context();
  const scope = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
  ];
  drawProcedures(ctx, new Map(), () => null, 10, true, scope);
  expect(ctx.moveTo).toHaveBeenCalledWith(0, 0);
  expect(ctx.lineTo).toHaveBeenCalledWith(10, 10);
  expect(ctx.clip).toHaveBeenCalledTimes(1);
  drawProcedures(ctx, new Map(), () => null, 10, true, [{ x: Number.NaN, y: 0 }]);
  expect(ctx.clip).toHaveBeenCalledTimes(1);
});
