import { expect, jest, test } from "@jest/globals";
import { createRadarCamera } from "../../src/frontend/radar-camera.mjs";

function setup(coarse = false) {
  const events = new Map();
  const removed = jest.fn();
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
    addEventListener: (name, fn) => events.set(name, fn),
    removeEventListener: removed,
    update: jest.fn(),
    rotateLeft: jest.fn(),
    enablePan: true,
    enableRotate: true,
    enableZoom: true,
  };
  const camera = { position: { ...vector } };
  const element = { addEventListener: jest.fn(), removeEventListener: jest.fn() };
  const onManualZoom = jest.fn();
  const onRangeChange = jest.fn();
  const view = createRadarCamera({
    camera,
    controls,
    scene: { rotation: { y: 0 } },
    element,
    windowRef: { matchMedia: () => ({ matches: coarse }) },
    onManualZoom,
    onRangeChange,
  });
  return { view, controls, camera, events, element, onManualZoom, onRangeChange, removed };
}

test("sets bounded camera distance and reports manual range changes", () => {
  const state = setup();
  expect(state.controls.minDistance).toBeGreaterThan(0);
  expect(state.controls.maxDistance).toBeGreaterThan(state.controls.minDistance);
  state.view.setRange(300);
  expect(state.view.range()).toBe(300);
  expect(state.onRangeChange).toHaveBeenLastCalledWith(300);
  state.camera.position.set(3, 4, 5);
  state.view.zoomBy(0.5);
  expect(state.view.range()).toBe(150);
  expect(state.camera.position.x / 3).toBeCloseTo(state.camera.position.y / 4);
  expect(state.camera.position.y / 4).toBeCloseTo(state.camera.position.z / 5);
  state.view.zoomBy(0.001);
  expect(state.view.range()).toBe(1);
  state.camera.position.y = 100;
  state.events.get("change")();
  expect(state.view.range()).toBeGreaterThan(1);
  state.camera.position.x = Number.NaN;
  state.events.get("change")();
  state.events.get("start")();
  expect(state.onManualZoom).toHaveBeenCalledTimes(3);
  state.view.dispose();
  expect(state.removed).toHaveBeenCalledTimes(2);
});

test("uses pinch zoom on coarse pointers and clamps it to one through 300 miles", () => {
  const state = setup(true);
  expect(state.controls.enableZoom).toBe(false);
  state.view.setRange(1);
  state.element.addEventListener.mock.calls[0][1]({
    pointerId: 1,
    pointerType: "touch",
    clientX: 0,
    clientY: 0,
  });
  state.element.addEventListener.mock.calls[0][1]({
    pointerId: 2,
    pointerType: "touch",
    clientX: 100,
    clientY: 0,
  });
  state.element.addEventListener.mock.calls[1][1]({
    pointerId: 2,
    pointerType: "touch",
    clientX: 200,
    clientY: 0,
    preventDefault() {},
  });
  expect(state.view.range()).toBe(1);
  state.element.addEventListener.mock.calls[2][1]({ pointerId: 1, pointerType: "touch" });
  state.element.addEventListener.mock.calls[2][1]({ pointerId: 2, pointerType: "touch" });
  state.view.setRange(300);
  state.element.addEventListener.mock.calls[0][1]({
    pointerId: 3,
    pointerType: "touch",
    clientX: 0,
    clientY: 0,
  });
  state.element.addEventListener.mock.calls[0][1]({
    pointerId: 4,
    pointerType: "touch",
    clientX: 100,
    clientY: 0,
  });
  state.element.addEventListener.mock.calls[1][1]({
    pointerId: 4,
    pointerType: "touch",
    clientX: 1,
    clientY: 0,
    preventDefault() {},
  });
  expect(state.view.range()).toBe(300);
  state.view.dispose();
});
