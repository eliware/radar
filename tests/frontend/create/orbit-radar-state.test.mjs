import { expect, jest, test } from "@jest/globals";
import { createOrbitRadarState } from "../../../src/frontend/create/orbit-radar-state.mjs";

test("reports the view range and rotation, and notifies on camera changes", () => {
  const listeners = new Map();
  const controls = {
    getAzimuthalAngle: jest.fn(() => -0.5),
    addEventListener: jest.fn((name, listener) => listeners.set(name, listener)),
    removeEventListener: jest.fn(),
    rotateLeft: jest.fn(),
    update: jest.fn(),
  };
  const radarCamera = { range: jest.fn(() => 20), zoomBy: jest.fn(), setRotation: jest.fn() };
  const state = createOrbitRadarState(controls, radarCamera);
  expect(state.northAngle()).toBe(-0.5);
  expect(state.range()).toBe(20);
  state.zoomBy(1.2);
  state.rotateBy(Math.PI / 12);
  state.setRotation((140 * Math.PI) / 180);
  expect(radarCamera.zoomBy).toHaveBeenCalledWith(1.2);
  expect(controls.rotateLeft).toHaveBeenCalledWith(-Math.PI / 12);
  expect(controls.update).toHaveBeenCalled();
  expect(radarCamera.setRotation).toHaveBeenCalledWith((140 * Math.PI) / 180);
  const listener = jest.fn();
  const detach = state.onViewChange(listener);
  expect(listener).toHaveBeenCalledWith(20);
  listeners.get("change")();
  expect(listener).toHaveBeenCalledTimes(2);
  detach();
  expect(controls.removeEventListener).toHaveBeenCalledWith("change", listeners.get("change"));
});

test("uses a zero angle when controls do not provide one", () => {
  const state = createOrbitRadarState({}, { range: () => 1 });
  expect(state.northAngle()).toBe(0);
});
