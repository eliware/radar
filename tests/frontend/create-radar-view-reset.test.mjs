import { expect, jest, test } from "@jest/globals";
import { createRadarViewReset } from "../../src/frontend/create-radar-view-reset.mjs";

test("reset restores configured view and auto zoom", () => {
  const radarCamera = { setRange: jest.fn(), setRotation: jest.fn() };
  const targets = { distances: () => [42] };
  const setAutoZoom = jest.fn();
  const rotation = (140 * Math.PI) / 180;
  createRadarViewReset(radarCamera, targets, setAutoZoom, 25, rotation)();
  expect(setAutoZoom).toHaveBeenCalledWith(true);
  expect(radarCamera.setRange).toHaveBeenCalledWith(47);
  expect(radarCamera.setRotation).toHaveBeenCalledWith(rotation);
});
