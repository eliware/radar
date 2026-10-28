import { expect, test } from "@jest/globals";
import { withAircraftDrawingStyle } from "../../../../src/frontend/draw/aircraft/style.mjs";

test("restores canvas drawing style after a draw callback", () => {
  const context = { fillStyle: "fill", strokeStyle: "stroke", font: "font", globalAlpha: 0.7 };
  withAircraftDrawingStyle(context, () => {
    context.fillStyle = "new fill";
    context.strokeStyle = "new stroke";
    context.font = "new font";
    context.globalAlpha = 0.2;
  });
  expect(context).toEqual({
    fillStyle: "fill",
    strokeStyle: "stroke",
    font: "font",
    globalAlpha: 0.7,
  });
});

test("restores canvas drawing style when drawing throws", () => {
  const context = { fillStyle: "fill", strokeStyle: "stroke", font: "font", globalAlpha: 0.7 };
  expect(() =>
    withAircraftDrawingStyle(context, () => {
      context.fillStyle = "new fill";
      throw new Error("draw failed");
    }),
  ).toThrow("draw failed");
  expect(context).toEqual({
    fillStyle: "fill",
    strokeStyle: "stroke",
    font: "font",
    globalAlpha: 0.7,
  });
});
