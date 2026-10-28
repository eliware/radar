import { expect, test } from "@jest/globals";
import * as THREE from "three";
import { createRadarViewportRadius } from "../../../../../src/frontend/radar/viewport/create/radius.mjs";

test("creates a live polling radius reader", () => {
  const camera = new THREE.PerspectiveCamera(48, 16 / 9, 0.05, 1000);
  camera.position.set(0, 64, 0);
  camera.lookAt(0, 0, 0);
  const reader = createRadarViewportRadius(
    camera,
    { target: new THREE.Vector3() },
    {
      clientWidth: 1280,
      clientHeight: 720,
    },
  );
  expect(reader()).toBeGreaterThan(25);
  expect(reader()).toBeLessThanOrEqual(300);
});
