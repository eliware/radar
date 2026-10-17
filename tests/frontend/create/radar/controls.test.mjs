import { beforeEach, expect, jest, test } from "@jest/globals";

const update = jest.fn();
const controls = {
  update,
  dispose: jest.fn(),
  getAzimuthalAngle: jest.fn(() => 0),
  target: { x: 0, y: 0, z: 0 },
};
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

const { createRadarControls } = await import("../../../../src/frontend/create/radar/controls.mjs");

beforeEach(() => {
  controls.update = update;
  controls.target.y = 0;
  update.mockClear();
});

function makeCamera() {
  return {
    position: { x: 0, y: 0, z: 0 },
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
}

test("creates altitude-axis controls and restores camera orientation on dispose", () => {
  const camera = makeCamera();
  const originalLookAt = camera.lookAt;
  const originalDispose = controls.dispose;
  const originalUpdate = update;
  const element = {};
  const result = createRadarControls(camera, element, 6076.12);

  expect(result).toBe(controls);
  expect(constructedUp).toEqual({ x: 0, y: 1, z: 0 });
  expect(constructedElement).toBe(element);
  expect(controls.maxPolarAngle).toBe(Math.PI / 2 - 0.01);
  expect(originalUpdate).toHaveBeenCalledTimes(1);
  controls.target.y = -3;
  camera.position.y = -2;
  result.update();
  expect(originalUpdate).toHaveBeenCalledTimes(2);
  expect(controls.target.y).toBe(-1);
  expect(camera.position.y).toBe(0);
  result.dispose();
  expect(originalDispose).toHaveBeenCalledTimes(1);
  expect(camera.up).toMatchObject({ x: 0, y: 0, z: -1 });
  expect(camera.lookAt).toBe(originalLookAt);
});

test.each([undefined, Number.NaN])(
  "uses MSL zero for missing or invalid home altitude: %s",
  (altitude) => {
    const camera = makeCamera();
    const result = createRadarControls(camera, {}, altitude);
    controls.target.y = -1;
    camera.position.y = -0.5;
    result.update();
    expect(controls.target.y).toBe(0);
    expect(camera.position.y).toBe(0.5);
  },
);
