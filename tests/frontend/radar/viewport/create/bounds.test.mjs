import { expect, test } from "@jest/globals";
import * as THREE from "three";
import { createRadarViewportBounds } from "../../../../../src/frontend/radar/viewport/create/bounds.mjs";

test("creates live bounds from viewport dimensions and home elevation", () => {
  const camera = new THREE.PerspectiveCamera(48, 16 / 9, 0.05, 1000);
  camera.position.set(0, 64, 0);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  const container = { clientWidth: 1280, clientHeight: 720 };
  const bounds = createRadarViewportBounds(THREE, camera, container, 310);
  expect(bounds()).toMatchObject({
    minRangeNm: expect.any(Number),
    maxRangeNm: expect.any(Number),
  });
  container.clientWidth = 0;
  expect(bounds().maxRangeNm).toBe(0);
});
