import { expect, jest, test } from "@jest/globals";

const ringView = { updateRange: jest.fn(), setConnected: jest.fn() };
const axisView = { updateRange: jest.fn(), setConnected: jest.fn() };
const createRadarRings = jest.fn(() => ringView);
const createRadarAxes = jest.fn(() => axisView);
jest.unstable_mockModule("../../../src/frontend/radar/overlays/rings.mjs", () => ({
  createRadarRings,
}));
jest.unstable_mockModule("../../../src/frontend/radar/overlays/axes.mjs", () => ({
  createRadarAxes,
}));
const { createRadarSceneOverlays } = await import("../../../src/frontend/radar/scene-overlays.mjs");

test("coordinates range and connection updates across ring and axis resources", () => {
  const THREE = {};
  const scene = {};
  const documentRef = {};
  const update = createRadarSceneOverlays(THREE, scene, documentRef);
  expect(createRadarRings).toHaveBeenCalledWith(THREE, scene, documentRef);
  expect(createRadarAxes).toHaveBeenCalledWith(THREE, scene);
  update(40);
  update.setConnected(true);
  expect(ringView.updateRange).toHaveBeenCalledWith(40);
  expect(axisView.updateRange).toHaveBeenCalledWith(40);
  expect(ringView.setConnected).toHaveBeenLastCalledWith(true);
  expect(axisView.setConnected).toHaveBeenLastCalledWith(true);
});
