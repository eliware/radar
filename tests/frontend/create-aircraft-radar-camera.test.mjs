import { expect, jest, test } from "@jest/globals";
import { createAircraftRadarCamera } from "../../src/frontend/create-aircraft-radar-camera.mjs";

test("configures camera defaults and tracks auto zoom state", () => {
  const camera = {
    setRange: jest.fn(),
    setRotation: jest.fn(),
  };
  const options = {};
  const createCamera = jest.fn((settings) => {
    Object.assign(options, settings);
    return camera;
  });
  const targets = { distances: jest.fn(() => [10]) };
  const state = createAircraftRadarCamera({
    createCamera,
    cameraOptions: { camera: "camera" },
    targets,
    defaultRangeNm: 25,
    defaultRotationDegrees: 140,
  });
  expect(options.camera).toBe("camera");
  expect(camera.setRange).toHaveBeenCalledWith(25);
  expect(camera.setRotation).toHaveBeenCalledWith((140 * Math.PI) / 180);
  expect(state.isAutoZoom()).toBe(true);
  options.onManualZoom();
  expect(state.isAutoZoom()).toBe(false);
  state.reset();
  expect(state.isAutoZoom()).toBe(true);
  expect(camera.setRange).toHaveBeenLastCalledWith(25);
  expect(targets.distances).toHaveBeenCalled();
});
