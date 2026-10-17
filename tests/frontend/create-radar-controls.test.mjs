import { expect, jest, test } from "@jest/globals";

const controls = { update: jest.fn(), dispose: jest.fn(), getAzimuthalAngle: jest.fn(() => 0) };
let constructedUp;
let constructedElement;
jest.unstable_mockModule("three/addons/controls/OrbitControls.js", () => ({
  OrbitControls: class {
    constructor(camera, element) {
      constructedUp = { x: camera.up.x, y: camera.up.y, z: camera.up.z };
      constructedElement = element;
      return controls;
    }
  },
}));

const { createRadarControls } = await import("../../src/frontend/create-radar-controls.mjs");

test("creates altitude-axis controls and restores camera orientation on dispose", () => {
  const camera = {
    up: {
      x: 0,
      y: 0,
      z: -1,
      set(x, y, z) {
        Object.assign(this, { x, y, z });
      },
    },
    lookAt: jest.fn(),
  };
  const originalLookAt = camera.lookAt;
  const originalDispose = controls.dispose;
  const element = {};
  const result = createRadarControls(camera, element);

  expect(result).toBe(controls);
  expect(constructedUp).toEqual({ x: 0, y: 1, z: 0 });
  expect(constructedElement).toBe(element);
  expect(controls.update).toHaveBeenCalledTimes(1);
  result.dispose();
  expect(originalDispose).toHaveBeenCalledTimes(1);
  expect(camera.up).toMatchObject({ x: 0, y: 0, z: -1 });
  expect(camera.lookAt).toBe(originalLookAt);
});
