import { expect, jest, test } from "@jest/globals";
import { createRadarCameraState } from "../../../../src/frontend/radar/camera/state.mjs";

test("manages bounded range, camera rotation, and distance-derived range", () => {
  const vector = {
    x: 0,
    y: 0,
    z: 0,
    set(x, y, z) {
      Object.assign(this, { x, y, z });
    },
  };
  const controls = {
    target: { ...vector },
    getAzimuthalAngle: jest.fn(() => 0.5),
    rotateLeft: jest.fn(),
    update: jest.fn(),
  };
  const camera = { position: { ...vector } };
  const onManualZoom = jest.fn();
  const onRangeChange = jest.fn();
  const state = createRadarCameraState({ camera, controls, onManualZoom, onRangeChange });
  state.setRange(500);
  expect(state.range()).toBe(300);
  state.setRotation(1);
  expect(controls.rotateLeft).toHaveBeenLastCalledWith(1.5);
  camera.position.y = Number.NaN;
  state.updateRangeFromCamera();
  expect(onRangeChange).toHaveBeenCalledTimes(1);
  camera.position.y = 20;
  state.updateRangeFromCamera();
  expect(onRangeChange).toHaveBeenCalledTimes(2);
  state.zoomBy(0.5);
  expect(onManualZoom).toHaveBeenCalledTimes(1);
});
