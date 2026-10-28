import { expect, jest, test } from "@jest/globals";
import { createCanvasRadarViewDraw } from "../../../../src/frontend/canvas-radar/view/draw.mjs";

test("redraws the canvas, updates water, and notifies range listeners", () => {
  const drawRadar = jest.fn();
  const waterLayer = { update: jest.fn() };
  const state = { range: 35 };
  const viewChanges = { emit: jest.fn() };
  createCanvasRadarViewDraw({ drawRadar, waterLayer, state, viewChanges })();
  expect(drawRadar).toHaveBeenCalledTimes(1);
  expect(waterLayer.update).toHaveBeenCalledTimes(1);
  expect(viewChanges.emit).toHaveBeenCalledWith(35);
});
