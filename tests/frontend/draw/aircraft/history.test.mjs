import { expect, jest, test } from "@jest/globals";
import { default as drawAircraftHistory } from "../../../../src/frontend/draw/aircraft/history.mjs";

test("draws history diamonds before each aircraft's current position", () => {
  const context = Object.fromEntries(
    ["beginPath", "moveTo", "lineTo", "closePath", "stroke"].map((name) => [name, jest.fn()]),
  );
  const history = [
    { x: 1, y: 2 },
    { x: 3, y: 4 },
    { x: 5, y: 6 },
  ];
  drawAircraftHistory(context, [{ history }, {}], "#888");
  expect(context.strokeStyle).toBe("#888");
  expect(context.stroke).toHaveBeenCalledTimes(2);
  expect(context.moveTo).toHaveBeenNthCalledWith(1, 1, -2);
  expect(context.lineTo).toHaveBeenNthCalledWith(1, 5, 2);
  expect(context.moveTo).toHaveBeenNthCalledWith(2, 3, 0);
  expect(context.lineTo).toHaveBeenNthCalledWith(4, 7, 4);
});

test("draws prepared history diamonds and restores the canvas opacity", () => {
  const context = Object.fromEntries(
    ["beginPath", "moveTo", "lineTo", "closePath", "stroke"].map((name) => [name, jest.fn()]),
  );
  let alpha = 0.8;
  Object.defineProperty(context, "globalAlpha", {
    get: () => alpha,
    set: (value) => {
      alpha = value;
    },
  });
  const strokeOpacities = [];
  context.stroke.mockImplementation(() => strokeOpacities.push(context.globalAlpha));
  const now = 120_000;
  drawAircraftHistory(
    context,
    [
      {
        history: [
          { x: 1, y: 1, recordedAt: now },
          { x: 2, y: 2, recordedAt: now - 60_000 },
          { x: 3, y: 3, recordedAt: now - 120_000 },
          { x: 4, y: 4, recordedAt: now },
        ],
      },
    ],
    "#888",
    now,
  );

  expect(context.globalAlpha).toBe(0.8);
  expect(context.stroke).toHaveBeenCalledTimes(2);
  expect(strokeOpacities).toEqual([0.8, 0.4]);
  expect(context.moveTo).toHaveBeenNthCalledWith(1, 1, -3);
  expect(context.moveTo).toHaveBeenNthCalledWith(2, 2, -2);
});
