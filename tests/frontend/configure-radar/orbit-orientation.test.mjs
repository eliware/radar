import { expect, jest, test } from "@jest/globals";
import { configureRadarOrbitOrientation } from "../../../src/frontend/configure-radar/orbit-orientation.mjs";

function setup() {
  const lookUps = [];
  const camera = {
    up: {
      x: 0,
      y: 1,
      z: 0,
      set(x, y, z) {
        Object.assign(this, { x, y, z });
      },
    },
    lookAt: jest.fn(() => lookUps.push({ x: camera.up.x, y: camera.up.y, z: camera.up.z })),
  };
  const controls = { getAzimuthalAngle: jest.fn(() => 0) };
  const originalLookAt = camera.lookAt;
  const restore = configureRadarOrbitOrientation(camera, controls, { x: 0, y: 0, z: -1 });
  return { camera, controls, lookUps, originalLookAt, restore };
}

test("keeps the north-up frame while OrbitControls uses altitude as its orbit axis", () => {
  const { camera, controls, lookUps, originalLookAt, restore } = setup();
  expect(camera.up).toMatchObject({ x: 0, y: 1, z: 0 });
  camera.lookAt({});
  expect(lookUps[0]).toEqual({ x: 0, y: 0, z: -1 });
  expect(camera.up).toMatchObject({ x: 0, y: 1, z: 0 });

  controls.getAzimuthalAngle.mockReturnValue(Math.PI / 2);
  camera.lookAt({});
  expect(lookUps[1].x).toBeCloseTo(-1);
  expect(lookUps[1].y).toBe(0);
  expect(lookUps[1].z).toBeCloseTo(0);
  expect(camera.up).toMatchObject({ x: 0, y: 1, z: 0 });

  restore();
  expect(camera.lookAt).toBe(originalLookAt);
});
