import { expect, jest, test } from "@jest/globals";
import { drawRadarScale, selectScaleDistance } from "../../../../src/frontend/draw/radar/scale.mjs";

test.each([
  [20, 475.2, 120, 5],
  [60, 120, 120, 50],
  [300, 1, 120, 200],
  [1, 140.8, 120, 1],
])("selects a useful scale for range %s", (range, radius, maxLength, expected) => {
  expect(selectScaleDistance(range, radius, maxLength)).toBe(expected);
});

test("draws the scale label and measured line", () => {
  const context = Object.fromEntries(
    ["fillText", "beginPath", "moveTo", "lineTo", "stroke"].map((name) => [name, jest.fn()]),
  );
  context.fillStyle = "#444444";
  context.strokeStyle = "#444444";
  drawRadarScale(context, 20, 475.2, 1080);
  expect(context.fillText).toHaveBeenCalledWith("5 NM", 14, 1046);
  expect(context.lineTo).toHaveBeenCalledWith(132.8, 1063);
  expect(context.stroke).toHaveBeenCalledTimes(1);
  expect(context.fillStyle).toBe("#ffffff");
  expect(context.strokeStyle).toBe("#ffffff");
});

test("draws one nautical mile at minimum range", () => {
  const context = Object.fromEntries(
    ["fillText", "beginPath", "moveTo", "lineTo", "stroke"].map((name) => [name, jest.fn()]),
  );
  drawRadarScale(context, 1, 140.8, 320);
  expect(context.fillText).toHaveBeenCalledWith("1 NM", 14, 286);
  expect(context.lineTo).toHaveBeenCalledWith(154.8, 303);
});

test("keeps the scale distance within the selected radar range", () => {
  expect(selectScaleDistance(300, 475.2, 120)).toBeLessThanOrEqual(300);
});
