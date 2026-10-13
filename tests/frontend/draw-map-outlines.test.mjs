import { expect, jest, test } from "@jest/globals";
import { drawMapOutlines } from "../../src/frontend/draw-map-outlines.mjs";

function context() {
  return Object.fromEntries(
    [
      "save",
      "beginPath",
      "arc",
      "clip",
      "setLineDash",
      "moveTo",
      "lineTo",
      "stroke",
      "restore",
    ].map((name) => [name, jest.fn()]),
  );
}

test("draws coast and lake outlines within the scope clip", () => {
  const ctx = context();
  const project = ({ x, z }) => ({ x, y: z });
  drawMapOutlines(
    ctx,
    {
      coastline: [
        [
          [0, 0],
          [1, 1],
          [Number.NaN, 2],
          [3, 3],
        ],
      ],
      lakes: [
        [
          [4, 4],
          [5, 5],
        ],
      ],
    },
    { latitude: 0, longitude: 0 },
    project,
    { x: 10, y: 20 },
    50,
  );
  expect(ctx.arc).toHaveBeenCalledWith(10, 20, 50, 0, Math.PI * 2);
  expect(ctx.clip).toHaveBeenCalledTimes(1);
  expect(ctx.strokeStyle).toBe("#383838");
  expect(ctx.moveTo).toHaveBeenCalledTimes(3);
  expect(ctx.lineTo).toHaveBeenCalledTimes(2);
  expect(ctx.stroke).toHaveBeenCalledTimes(2);
  expect(ctx.restore).toHaveBeenCalledTimes(1);
});

test.each([
  [null, { coastline: [], lakes: [] }],
  [{ latitude: 0, longitude: 0 }, null],
])("skips data without a location or outline set", (location, outlines) => {
  const ctx = context();
  drawMapOutlines(ctx, outlines, location, jest.fn(), { x: 0, y: 0 }, 10);
  expect(ctx.save).not.toHaveBeenCalled();
});

test("starts a new path after an invalid coordinate", () => {
  const ctx = context();
  drawMapOutlines(
    ctx,
    {
      coastline: [
        [
          [0, 0],
          [Number.NaN, 0],
          [1, 1],
        ],
      ],
    },
    { latitude: 0, longitude: 0 },
    ({ x, z }) => ({ x, y: z }),
    { x: 0, y: 0 },
    10,
  );
  expect(ctx.moveTo).toHaveBeenCalledTimes(2);
  expect(ctx.lineTo).not.toHaveBeenCalled();
});
