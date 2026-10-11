import { expect, jest, test } from "@jest/globals";
import {
  attachMobileRadarGestures,
  configureMobileRadarControls,
  hasCoarsePointer,
} from "../../src/frontend/mobile-radar-gestures.mjs";

test("detects a coarse pointer only when the browser reports one", () => {
  expect(hasCoarsePointer({ matchMedia: () => ({ matches: true }) })).toBe(true);
  expect(hasCoarsePointer({ matchMedia: () => ({ matches: false }) })).toBe(false);
  expect(hasCoarsePointer({ matchMedia: () => undefined })).toBe(false);
  expect(hasCoarsePointer({})).toBe(false);
});

test("locks mobile controls and rotates the scene around home", () => {
  const listeners = new Map();
  const element = {
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: jest.fn(),
  };
  const controls = { enablePan: true, enableRotate: true, enableZoom: true };
  const scene = { rotation: { y: 0 } };
  const remove = configureMobileRadarControls(controls, scene, element, {
    matchMedia: () => ({ matches: true }),
  });
  expect(controls).toEqual({ enablePan: false, enableRotate: false, enableZoom: false });
  listeners.get("pointerdown")({ pointerId: 1, pointerType: "touch", clientX: 0, clientY: 0 });
  listeners.get("pointerdown")({ pointerId: 2, pointerType: "touch", clientX: 100, clientY: 0 });
  listeners.get("pointermove")({
    pointerId: 2,
    pointerType: "touch",
    clientX: 0,
    clientY: 100,
    preventDefault() {},
  });
  expect(scene.rotation.y).toBeCloseTo(Math.PI / 2);
  remove();
});

test("keeps desktop controls enabled", () => {
  const controls = { enablePan: true, enableRotate: true, enableZoom: true };
  const remove = configureMobileRadarControls(controls, {}, {}, {});
  expect(controls).toEqual({ enablePan: true, enableRotate: true, enableZoom: true });
  remove();
});

test("ignores one finger and reports two finger zoom and twist", () => {
  const listeners = new Map();
  const element = {
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: jest.fn(),
    setPointerCapture: jest.fn(),
  };
  const onZoom = jest.fn();
  const onRotate = jest.fn();
  const remove = attachMobileRadarGestures(element, { onZoom, onRotate });
  const event = (pointerId, clientX, clientY) => ({
    pointerId,
    pointerType: "touch",
    clientX,
    clientY,
    preventDefault: jest.fn(),
  });
  listeners.get("pointerdown")(event(1, 0, 0));
  listeners.get("pointermove")(event(1, 10, 10));
  expect(onZoom).not.toHaveBeenCalled();
  listeners.get("pointerup")(event(1, 10, 10));
  listeners.get("pointerdown")(event(1, 0, 0));
  listeners.get("pointerdown")(event(2, 100, 0));
  const twist = event(2, 0, 100);
  listeners.get("pointermove")(twist);
  expect(twist.preventDefault).toHaveBeenCalled();
  expect(onZoom).toHaveBeenCalledWith(1);
  expect(onRotate).toHaveBeenCalledWith(expect.closeTo(Math.PI / 2));
  listeners.get("pointermove")(event(2, 0, 0));
  listeners.get("pointercancel")(event(1, 10, 10));
  listeners.get("pointerup")(event(2, 0, 100));
  listeners.get("pointerdown")(event(1, 0, 0));
  listeners.get("pointerdown")(event(2, -100, -1.745));
  listeners.get("pointermove")(event(2, -100, 1.745));
  expect(onRotate).toHaveBeenLastCalledWith(expect.closeTo(-0.0349, 2));
  listeners.get("pointerdown")(event(3, 100, 100));
  listeners.get("pointerup")(event(3, 100, 100));
  remove();
  expect(element.removeEventListener).toHaveBeenCalledTimes(4);
});

test("ignores mouse pointers and normalizes rotation across north", () => {
  const listeners = new Map();
  const element = {
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener() {},
  };
  const onRotate = jest.fn();
  attachMobileRadarGestures(element, { onZoom: jest.fn(), onRotate });
  const send = (type, pointerId, clientX, clientY, pointerType = "touch") =>
    listeners.get(type)({ pointerId, pointerType, clientX, clientY, preventDefault() {} });
  send("pointerdown", 1, 0, 0, "mouse");
  send("pointerdown", 1, 0, 0);
  send("pointerdown", 2, -100, 1.745);
  send("pointermove", 2, -100, -1.745);
  expect(onRotate).toHaveBeenCalledWith(expect.closeTo(0.0349, 2));
  send("pointerup", 1, 0, 0);
  send("pointerup", 2, -100, -1.745);
  send("pointerdown", 1, 0, 0);
  send("pointerdown", 2, -100, -1.745);
  send("pointermove", 2, -100, 1.745);
  expect(onRotate).toHaveBeenLastCalledWith(expect.closeTo(-0.0349, 2));
});
