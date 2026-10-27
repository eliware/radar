import { expect, jest, test } from "@jest/globals";
import { drawAirways } from "../../../src/frontend/draw/airways.mjs";

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

const point = (fix, x, z, rangeNm = Math.hypot(x, z)) => ({ fix, x, z, rangeNm });

test("draws airway segments, midpoint identifiers, and labeled fix markers", () => {
  const ctx = context();
  const airway = {
    id: "V12:0",
    name: "V12",
    type: "V",
    points: [point("FIXA", -2, 0), point("FIXB", 2, 0)],
  };
  drawAirways(ctx, new Map([[airway.id, airway]]), (item) => ({ x: item.x, y: item.z }), {
    Q: true,
    J: true,
    V: true,
  });
  expect(ctx.strokeStyle).toBe("#4f4d32");
  expect(ctx.fillText).toHaveBeenCalledWith("V12", 0, 0);
  expect(ctx.fillText).toHaveBeenCalledWith("FIXA", 5, -5);
  expect(ctx.fillText).toHaveBeenCalledWith("FIXB", 9, -5);
  expect(ctx.lineTo).toHaveBeenCalledWith(2, 0);
});

test("uses distinct muted colors for Q, J, and V airway layers", () => {
  for (const [type, color] of [
    ["Q", "#31534d"],
    ["J", "#54394b"],
    ["V", "#4f4d32"],
  ]) {
    const ctx = context();
    drawAirways(
      ctx,
      new Map([[type, { name: `${type}1`, type, points: [point("A", 1, 0)] }]]),
      (item) => ({ x: item.x, y: item.z }),
      { Q: true, J: true, V: true },
    );
    expect(ctx.strokeStyle).toBe(color);
  }
});

test("omits hidden, distant, unknown, and invalid airway content", () => {
  const ctx = context();
  const routes = new Map([
    ["Q", { name: "Q1", type: "Q", points: [point("A", 1, 0), point("B", 2, 0)] }],
    ["J", { name: "J1", type: "J", points: [point("C", 301, 0), point("D", 302, 0)] }],
    ["X", { name: "X1", type: "X", points: [point("E", 0, 0)] }],
    ["V", { name: "V1", type: "V", points: [point("BAD", 0, 0)] }],
  ]);
  drawAirways(ctx, routes, (item) => (item.fix === "BAD" ? null : { x: item.x, y: item.z }), {
    Q: false,
    J: true,
    V: true,
  });
  expect(ctx.fillText).not.toHaveBeenCalled();
  expect(ctx.stroke).not.toHaveBeenCalled();
});

test("draws a segment whose endpoints share a coordinate", () => {
  const ctx = context();
  const routes = new Map([
    ["Q", { name: "Q1", type: "Q", points: [point("A", 0, 0), point("B", 0, 0)] }],
  ]);
  drawAirways(ctx, routes, (item) => ({ x: item.x, y: item.z }), { Q: true, J: true, V: true });
  expect(ctx.stroke).toHaveBeenCalled();
});
