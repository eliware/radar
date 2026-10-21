import { expect, test } from "@jest/globals";
import * as THREE from "three";
import {
  createRadarViewportBounds,
  getRadarViewportBounds,
} from "../../../../src/frontend/radar/viewport/bounds.mjs";

function cameraAt(polarDegrees, distance = 64) {
  const camera = new THREE.PerspectiveCamera(48, 16 / 9, 0.05, 1000);
  const polar = (polarDegrees * Math.PI) / 180;
  camera.position.set(distance * Math.sin(polar), distance * Math.cos(polar), 0);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  return camera;
}

test("builds a bounded world-space viewport from frustum plane intersections", () => {
  const bounds = getRadarViewportBounds(THREE, cameraAt(0), 1280, 720, -0.05);
  expect(bounds.maxRangeNm).toBeGreaterThan(25);
  expect(bounds.maxRangeNm).toBeLessThanOrEqual(300);
  expect(bounds.minX).toBeLessThan(0);
  expect(bounds.maxX).toBeGreaterThan(0);
  expect(bounds.minZ).toBeLessThan(0);
  expect(bounds.maxZ).toBeGreaterThan(0);
});

test("bounds a tilted footprint without treating horizon misses as infinite", () => {
  const bounds = getRadarViewportBounds(THREE, cameraAt(60), 1280, 720);
  expect(bounds.maxRangeNm).toBeLessThanOrEqual(300);
  expect(bounds.maxRangeNm).toBeGreaterThan(50);
  expect(Number.isFinite(bounds.minX)).toBe(true);
});

test("returns empty bounds when the viewport has no size", () => {
  const bounds = getRadarViewportBounds(THREE, cameraAt(0), 0, 720);
  expect(bounds.maxRangeNm).toBe(0);
  expect(bounds.minRangeNm).toBe(300);
});

test("returns empty bounds when no frustum edge crosses map layers", () => {
  const flat = {
    Vector3: class {
      constructor(x, y, z) {
        Object.assign(this, { x, y, z });
      }
      unproject() {
        this.y = 100;
        return this;
      }
    },
  };
  expect(getRadarViewportBounds(flat, { updateMatrixWorld() {} }, 800, 600).maxRangeNm).toBe(0);
});

test("creates live bounds from viewport dimensions and home elevation", () => {
  const camera = cameraAt(0);
  const container = { clientWidth: 1280, clientHeight: 720 };
  const bounds = createRadarViewportBounds(THREE, camera, container, 310);
  expect(bounds()).toMatchObject({
    minRangeNm: expect.any(Number),
    maxRangeNm: expect.any(Number),
  });
  container.clientWidth = 0;
  expect(bounds().maxRangeNm).toBe(0);
});
