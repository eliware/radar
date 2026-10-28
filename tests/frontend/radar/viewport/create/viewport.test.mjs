import { expect, test } from "@jest/globals";
import * as THREE from "three";
import { createRadarViewport } from "../../../../../src/frontend/radar/viewport/create/viewport.mjs";

test("combines polling radius and frustum bounds", () => {
  const camera = new THREE.PerspectiveCamera(48, 16 / 9, 0.05, 1000);
  camera.position.set(0, 64, 0);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  const viewport = createRadarViewport(
    THREE,
    camera,
    { target: new THREE.Vector3() },
    {
      clientWidth: 1280,
      clientHeight: 720,
    },
    0,
  );
  expect(viewport.visibleRadiusNm()).toBeGreaterThan(25);
  expect(viewport.getViewportBounds().maxRangeNm).toBeGreaterThan(0);
});
