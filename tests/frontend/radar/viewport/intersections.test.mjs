import { expect, test } from "@jest/globals";
import * as THREE from "three";
import { getFrustumPlaneIntersections } from "../../../../src/frontend/radar/viewport/intersections.mjs";

test("calculates finite intersections between the camera frustum and altitude planes", () => {
  const camera = new THREE.PerspectiveCamera(48, 16 / 9, 0.05, 1000);
  camera.position.set(0, 64, 0);
  camera.lookAt(0, 0, 0);
  const points = getFrustumPlaneIntersections(THREE, camera);
  expect(points.length).toBeGreaterThan(0);
  expect(points.every(({ x, z }) => Number.isFinite(x) && Number.isFinite(z))).toBe(true);
});
