import { expect, jest, test } from "@jest/globals";
import { configureMobileRadarControls } from "../../src/frontend/mobile-radar-gestures.mjs";

test("locks mobile controls and rotates the scene around home", () => {
  const listeners = new Map();
  const element = {
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: jest.fn(),
  };
  const controls = {
    enablePan: true,
    enableRotate: true,
    enableZoom: true,
    rotateLeft: jest.fn(),
    update: jest.fn(),
  };
  const remove = configureMobileRadarControls(controls, element, {
    matchMedia: () => ({ matches: true }),
  });
  expect(controls).toMatchObject({ enablePan: false, enableRotate: false, enableZoom: false });
  listeners.get("pointerdown")({ pointerId: 1, pointerType: "touch", clientX: 0, clientY: 0 });
  listeners.get("pointerdown")({ pointerId: 2, pointerType: "touch", clientX: 100, clientY: 0 });
  listeners.get("pointermove")({
    pointerId: 2,
    pointerType: "touch",
    clientX: 0,
    clientY: 100,
    preventDefault() {},
  });
  expect(controls.rotateLeft).toHaveBeenCalledWith(-Math.PI / 2);
  expect(controls.update).toHaveBeenCalled();
  remove();
});

test("keeps desktop controls enabled", () => {
  const controls = { enablePan: true, enableRotate: true, enableZoom: true };
  const remove = configureMobileRadarControls(controls, {}, {});
  expect(controls).toEqual({ enablePan: true, enableRotate: true, enableZoom: true });
  remove();
});
