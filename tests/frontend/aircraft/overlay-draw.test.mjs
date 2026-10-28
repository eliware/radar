import { expect, jest, test } from "@jest/globals";
import * as THREE from "three";
import { createOverlayDrawer } from "../../../src/frontend/aircraft/overlay-draw.mjs";

test("creates a callable aircraft overlay renderer", () => {
  const draw = createOverlayDrawer({
    THREE: {},
    container: {},
    windowRef: {},
    canvas: {},
    context: {},
  });
  expect(draw).toEqual(expect.any(Function));
});

test("reuses the camera projector when drawing repeatedly with the same camera", () => {
  const context = new Proxy(
    {
      canvas: { clientWidth: 800 },
      globalAlpha: 1,
      clearRect: jest.fn(),
      fillText: jest.fn(),
      measureText: () => ({ width: 20 }),
    },
    { get: (target, key) => target[key] ?? jest.fn() },
  );
  const draw = createOverlayDrawer({
    THREE,
    container: { clientWidth: 800, clientHeight: 600 },
    windowRef: { devicePixelRatio: 1 },
    canvas: { width: 0, height: 0 },
    context,
  });
  const camera = new THREE.PerspectiveCamera(48, 4 / 3, 0.05, 100);
  camera.position.set(1, 2, -1);
  const args = [new Map(), new Map(), { latitude: 43, longitude: -70 }, 0, camera, 20];

  draw(...args);
  draw(...args);

  expect(context.clearRect).toHaveBeenCalledTimes(2);
  expect(context.fillText).toHaveBeenCalledWith(expect.stringContaining("°"), 752, 30);
});
