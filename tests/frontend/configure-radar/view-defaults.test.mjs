import { expect, jest, test } from "@jest/globals";
import { configureRadarViewDefaults } from "../../../src/frontend/configure-radar/view-defaults.mjs";

test("sets configured defaults and returns a reset action", () => {
  const radarCamera = { setRange: jest.fn(), setRotation: jest.fn() };
  const targets = { distances: () => [] };
  const setAutoZoom = jest.fn();
  const reset = configureRadarViewDefaults(radarCamera, targets, setAutoZoom, 25, 140);
  expect(radarCamera.setRange).toHaveBeenCalledWith(25);
  expect(radarCamera.setRotation).toHaveBeenCalledWith((140 * Math.PI) / 180);
  expect(reset).toEqual(expect.any(Function));
  reset();
  expect(setAutoZoom).toHaveBeenCalledWith(true);
  expect(radarCamera.setRange).toHaveBeenLastCalledWith(25);
  expect(radarCamera.setRotation).toHaveBeenLastCalledWith((140 * Math.PI) / 180);
});
