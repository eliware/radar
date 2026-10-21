import { expect, jest, test } from "@jest/globals";
import * as THREE from "three";
import { createAircraftDisplayOverlay } from "../../../src/frontend/aircraft/display-overlay.mjs";
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

test("omits map labels and aircraft behind the camera", () => {
  const context = new Proxy(
    {
      canvas: { clientWidth: 800 },
      globalAlpha: 1,
      fillText: jest.fn(),
      measureText: () => ({ width: 20 }),
    },
    { get: (target, key) => target[key] ?? jest.fn() },
  );
  const canvas = { style: {}, getContext: () => context, remove: jest.fn() };
  const container = { clientWidth: 800, clientHeight: 600, appendChild: jest.fn() };
  const overlay = createAircraftDisplayOverlay({
    THREE,
    container,
    windowRef: { devicePixelRatio: 1 },
    documentRef: { createElement: () => canvas },
  });
  const camera = new THREE.PerspectiveCamera(48, 4 / 3, 0.05, 100);
  camera.up.set(0, 0, -1);
  camera.position.set(0, 20, 0);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  const aircraft = new Map([
    ["front", { icao: "front", callsign: "FRONT", latitude: 43, longitude: -70, altitudeFeet: 0 }],
    [
      "back",
      { icao: "back", callsign: "BACK", latitude: 43, longitude: -70, altitudeFeet: 200000 },
    ],
  ]);
  const airports = new Map([
    ["front", { faaId: "front", icao: "FRONT-APT", latitude: 43, longitude: -70, rangeNm: 0 }],
    [
      "back",
      {
        faaId: "back",
        icao: "BACK-APT",
        latitude: 43,
        longitude: -70,
        elevationFeet: 200000,
        rangeNm: 0,
      },
    ],
  ]);
  overlay.draw(
    aircraft,
    new Map(),
    { latitude: 43, longitude: -70 },
    0,
    camera,
    20,
    true,
    airports,
  );
  overlay.draw(new Map(), new Map(), { latitude: 43, longitude: -70 }, 0, camera, 20);
  const labels = context.fillText.mock.calls.map(([text]) => text);
  expect(labels).toContain("FRONT");
  expect(labels).toContain("FRONT-APT");
  expect(labels).not.toContain("BACK");
  expect(labels).not.toContain("BACK-APT");
  overlay.destroy();
});
