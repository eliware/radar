import { expect, jest, test } from "@jest/globals";
import { clipRadarScope } from "../../src/frontend/clip-radar-scope.mjs";

function context() {
  return Object.fromEntries(
    ["beginPath", "moveTo", "lineTo", "closePath", "clip"].map((method) => [method, jest.fn()]),
  );
}

test("clips to a valid polygon scope", () => {
  const ctx = context();
  const scope = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
  ];
  expect(clipRadarScope(ctx, scope)).toBe(true);
  expect(ctx.moveTo).toHaveBeenCalledWith(0, 0);
  expect(ctx.lineTo).toHaveBeenCalledWith(10, 0);
  expect(ctx.lineTo).toHaveBeenCalledWith(10, 10);
  expect(ctx.closePath).toHaveBeenCalledTimes(1);
  expect(ctx.clip).toHaveBeenCalledTimes(1);
});

test.each([
  [null],
  [[]],
  [
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ],
  ],
  [
    [
      { x: Number.NaN, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ],
  ],
  [
    [
      { x: 0, y: Number.NaN },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ],
  ],
])("ignores an invalid polygon scope", (scope) => {
  const ctx = context();
  expect(clipRadarScope(ctx, scope)).toBe(false);
  expect(ctx.clip).not.toHaveBeenCalled();
});
