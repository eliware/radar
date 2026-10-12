import { expect, jest, test } from "@jest/globals";
import { createOrbitRadarControls } from "../../src/frontend/create-orbit-radar-controls.mjs";

test("maps zoom, rotation, joystick, and north drag to camera controls", () => {
  const controls = {
    rotateLeft: jest.fn(),
    rotateUp: jest.fn(),
    update: jest.fn(),
    getAzimuthalAngle: jest.fn(() => 0.4),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
  const radarCamera = { zoomBy: jest.fn(), range: jest.fn(() => 20) };
  const view = createOrbitRadarControls(controls, radarCamera);
  view.zoom(0.8);
  view.rotate(1);
  view.tilt(-1);
  view.rotateBy(Math.PI / 2);
  view.orbitBy(0.2, 0.1);
  expect(radarCamera.zoomBy).toHaveBeenCalledWith(0.8);
  expect(controls.rotateLeft).toHaveBeenCalledWith(Math.PI / 12);
  expect(controls.rotateLeft).toHaveBeenCalledWith(-Math.PI / 2);
  expect(controls.rotateLeft).toHaveBeenCalledWith(-0.2);
  expect(controls.rotateUp).toHaveBeenCalledWith(Math.PI / 18);
  expect(controls.rotateUp).toHaveBeenCalledWith(0.1);
  expect(view.northAngle()).toBe(0.4);
  expect(view.range()).toBe(20);
  const listener = jest.fn();
  const unsubscribe = view.onViewChange(listener);
  expect(controls.addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  const notify = controls.addEventListener.mock.calls[0][1];
  notify();
  expect(listener).toHaveBeenCalledWith(20);
  unsubscribe();
  expect(controls.removeEventListener).toHaveBeenCalledWith("change", notify);
  expect(controls.update).toHaveBeenCalledTimes(4);
  const defaultAngleView = createOrbitRadarControls(
    { rotateLeft: jest.fn(), rotateUp: jest.fn(), update: jest.fn() },
    radarCamera,
  );
  expect(defaultAngleView.northAngle()).toBe(0);
});
