import { expect, test } from "@jest/globals";
import * as THREE from "three";
import {
  createRadarViewport,
  createRadarViewportRadius,
  getRadarViewportRadius,
} from "../../../../src/frontend/radar/viewport/radius.mjs";

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

test("creates a live polling radius reader", () => {
  const controls = { target: new THREE.Vector3() };
  const reader = createRadarViewportRadius(cameraAt(0), controls, {
    clientWidth: 1280,
    clientHeight: 720,
  });
  expect(reader()).toBeGreaterThan(25);
  expect(reader()).toBeLessThanOrEqual(300);
});

test("combines stable polling radius with live frustum bounds", () => {
  const camera = cameraAt(0);
  const controls = { target: new THREE.Vector3() };
  const viewport = createRadarViewport(
    THREE,
    camera,
    controls,
    {
      clientWidth: 1280,
      clientHeight: 720,
    },
    0,
  );
  expect(viewport.visibleRadiusNm()).toBeGreaterThan(25);
  expect(viewport.getViewportBounds().maxRangeNm).toBeGreaterThan(0);
});

test("returns a safe radius for missing camera and dimensions", () => {
  expect(getRadarViewportRadius(null, null, 800, 600)).toBe(1);
});
