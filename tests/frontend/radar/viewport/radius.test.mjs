import { expect, test } from "@jest/globals";
import * as THREE from "three";
import { getRadarViewportRadius } from "../../../../src/frontend/radar/viewport/radius.mjs";

function cameraAt(polarDegrees, distance = 64) {
  const camera = new THREE.PerspectiveCamera(48, 16 / 9, 0.05, 1000);
  const polar = (polarDegrees * Math.PI) / 180;
  camera.position.set(distance * Math.sin(polar), distance * Math.cos(polar), 0);
  camera.lookAt(0, 0, 0);
  return camera;
}

test("keeps remote polling radius tied to zoom, not camera tilt", () => {
  const camera = cameraAt(0);
  const target = new THREE.Vector3();
  const topDown = getRadarViewportRadius(camera, target, 1280, 720);
  camera.position.set(64, 0, 0);
  camera.lookAt(target);
  expect(getRadarViewportRadius(camera, target, 1280, 720)).toBeCloseTo(topDown);
});

test("returns a safe radius for missing camera and dimensions", () => {
  expect(getRadarViewportRadius(null, null, 800, 600)).toBe(1);
});
