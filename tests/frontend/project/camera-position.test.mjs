import { expect, test } from "@jest/globals";
import * as THREE from "three";
import { createCameraProjector } from "../../../src/frontend/project/camera-position.mjs";

test("projects visible positions and rejects positions behind the camera", () => {
  const camera = new THREE.PerspectiveCamera(48, 1, 0.05, 100);
  camera.up.set(0, 0, -1);
  camera.position.set(0, 20, 0);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  const project = createCameraProjector(THREE, camera);
  const visible = project({ x: 0, y: 0, z: 0 }, 800, 600);
  expect(visible.x).toBeCloseTo(400);
  expect(visible.y).toBeCloseTo(300);
  expect(project({ x: 0, y: 30, z: 0 }, 800, 600)).toBeNull();
});

test("projects positions for simple cameras without depth matrices", () => {
  const camera = {};
  const THREEStub = {
    Vector3: class {
      set(x, y, z) {
        Object.assign(this, { x, y, z });
        return this;
      }
      project() {
        return this;
      }
    },
  };
  expect(createCameraProjector(THREEStub, camera)({ x: 0, y: 0, z: 0 }, 100, 50)).toEqual({
    x: 50,
    y: 25,
  });
});
