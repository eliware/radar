import { expect, jest, test } from "@jest/globals";
import { createRadarViewReset } from "../../src/frontend/create-radar-view-reset.mjs";

test("reset restores north-up view and auto zoom", () => {
  const scene = { rotation: { y: 1 } };
  const radarCamera = { setRange: jest.fn() };
  const targets = { distances: () => [42] };
  const setAutoZoom = jest.fn();
  createRadarViewReset(scene, radarCamera, targets, setAutoZoom)();
  expect(scene.rotation.y).toBe(0);
  expect(setAutoZoom).toHaveBeenCalledWith(true);
  expect(radarCamera.setRange).toHaveBeenCalledWith(47);
});
