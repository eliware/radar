import { expect, jest, test } from "@jest/globals";
import * as THREE from "three";
import { createOverlayProjection } from "../../../../src/frontend/aircraft/overlay/projection.mjs";

test("prepares a resized camera projector for aircraft and references", () => {
  const context = { setTransform: jest.fn() };
  const canvas = { width: 0, height: 0 };
  const projection = createOverlayProjection({
    THREE,
    container: { clientWidth: 800, clientHeight: 600 },
    windowRef: { devicePixelRatio: 2 },
    canvas,
    context,
  });
  const camera = new THREE.PerspectiveCamera(48, 4 / 3, 0.05, 100);
  camera.position.z = 10;
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  const view = projection.prepare(camera, { latitude: 43, longitude: -70 }, 0);
  expect(view).toEqual(expect.objectContaining({ width: 800, height: 600 }));
  expect(canvas).toMatchObject({ width: 1600, height: 1200 });
  expect(view.project({ x: 0, y: 0, z: 0 })).toEqual(
    expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) }),
  );
  expect(view.projectReference({ latitude: 43.1, longitude: -70, elevationFeet: 0 })).toEqual(
    expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) }),
  );
  projection.prepare(camera, { latitude: 43, longitude: -70 }, 0);
  expect(context.setTransform).toHaveBeenCalledTimes(1);
});

test("uses unit dimensions and pixel ratio when browser values are absent", () => {
  const canvas = { width: 0, height: 0 };
  const projection = createOverlayProjection({
    THREE,
    container: {},
    windowRef: {},
    canvas,
    context: { setTransform: jest.fn() },
  });
  const camera = new THREE.PerspectiveCamera();
  expect(projection.prepare(camera, null, 0)).toEqual(
    expect.objectContaining({ width: 1, height: 1 }),
  );
  expect(canvas).toMatchObject({ width: 1, height: 1 });
});
