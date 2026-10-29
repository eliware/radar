import { expect, jest, test } from "@jest/globals";
import { drawRadarScale } from "../../../../src/frontend/draw/radar/scale.mjs";

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
