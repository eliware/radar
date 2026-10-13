import { expect, jest, test } from "@jest/globals";
import { drawIlsApproaches } from "../../src/frontend/draw-ils-approaches.mjs";

function context() {
  return Object.fromEntries(
    ["save", "restore", "setLineDash", "beginPath", "moveTo", "lineTo", "stroke", "fillText"].map(
      (method) => [method, jest.fn()],
    ),
  );
}

const approach = {
  latitude: 43,
  longitude: -70,
  elevationFeet: 100,
  rangeNm: 2,
  magneticCourse: 100,
  magneticVariation: 10,
  magneticVariationHemisphere: "W",
  glideSlopeDegrees: 3,
  runwayEnd: "11",
};

test("draws a dashed ten-mile approach line with a descending glide path", () => {
  const ctx = context();
  const points = [];
  drawIlsApproaches(
    ctx,
    new Map([["PWM:11", approach]]),
    (point) => (
      points.push(point),
      {
        x: point.longitude,
        y: point.elevationFeet,
      }
    ),
    20,
  );
  expect(ctx.strokeStyle).toBe("#00b8cc");
  expect(ctx.setLineDash).toHaveBeenNthCalledWith(1, [4, 4]);
  expect(ctx.moveTo).toHaveBeenCalledWith(points[1].longitude, points[1].elevationFeet);
  expect(ctx.lineTo).toHaveBeenCalledWith(points[0].longitude, points[0].elevationFeet);
  expect(points[1].elevationFeet).toBeGreaterThan(points[0].elevationFeet);
  expect(ctx.fillText).toHaveBeenCalledWith(
    "ILS 11",
    points[0].longitude,
    points[0].elevationFeet - 7,
  );
});

test("skips hidden, distant, invalid, and out-of-range courses", () => {
  const ctx = context();
  const rows = new Map([
    ["FAR", { ...approach, rangeNm: 30 }],
    ["NO-COURSE", { ...approach, magneticCourse: Number.NaN }],
    ["BAD-PROJECTION", { ...approach, runwayEnd: "BAD" }],
  ]);
  drawIlsApproaches(
    ctx,
    rows,
    (point) => (point.runwayEnd === "BAD" ? null : { x: 1, y: 2 }),
    20,
    false,
  );
  expect(ctx.stroke).not.toHaveBeenCalled();
  drawIlsApproaches(ctx, rows, (point) => (point.runwayEnd === "BAD" ? null : { x: 1, y: 2 }), 20);
  expect(ctx.stroke).not.toHaveBeenCalled();
  expect(ctx.restore).toHaveBeenCalledTimes(1);
});

test("uses east variation and a flat path when glide-slope data is absent", () => {
  const ctx = context();
  const points = [];
  const item = {
    ...approach,
    magneticVariationHemisphere: "E",
    glideSlopeDegrees: Number.NaN,
    elevationFeet: Number.NaN,
  };
  drawIlsApproaches(
    ctx,
    new Map([["X", item]]),
    (point) => (points.push(point), { x: 1, y: point.elevationFeet }),
    20,
  );
  expect(points[1].elevationFeet).toBe(0);
  expect(points[1].longitude).toBeLessThan(item.longitude);
  const missingVariation = { ...item, magneticCourse: 180, magneticVariation: Number.NaN };
  drawIlsApproaches(ctx, new Map([["MISSING-VAR", missingVariation]]), () => ({ x: 1, y: 2 }), 20);
  expect(ctx.stroke).toHaveBeenCalledTimes(2);
});
