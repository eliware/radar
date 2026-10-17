import { expect, jest, test } from "@jest/globals";
import { createRadarRenderLoop } from "../../../src/frontend/radar/render-loop.mjs";

test("renders frames, resizes the camera, and stops its browser hooks", () => {
  const callbacks = [];
  const windowRef = {
    requestAnimationFrame: jest.fn((callback) => {
      callbacks.push(callback);
      return callbacks.length;
    }),
    cancelAnimationFrame: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
  const renderer = { render: jest.fn(), setSize: jest.fn() };
  const camera = { updateProjectionMatrix: jest.fn() };
  const scene = {};
  const container = { clientWidth: 0, clientHeight: 0 };
  const stop = createRadarRenderLoop({ renderer, scene, camera, container, windowRef });
  const resize = windowRef.addEventListener.mock.calls[0][1];
  resize();
  expect(renderer.setSize).not.toHaveBeenCalled();
  container.clientWidth = 800;
  container.clientHeight = 600;
  resize();
  expect(camera.aspect).toBeCloseTo(4 / 3);
  expect(renderer.setSize).toHaveBeenCalledWith(800, 600);
  callbacks[0]();
  expect(renderer.render).toHaveBeenCalledWith(scene, camera);
  expect(windowRef.requestAnimationFrame).toHaveBeenCalledTimes(2);
  stop();
  expect(windowRef.cancelAnimationFrame).toHaveBeenCalledWith(2);
  expect(windowRef.removeEventListener).toHaveBeenCalledWith("resize", resize);
});

test("resizes the renderer when its container changes size", () => {
  let onResize;
  const observer = { observe: jest.fn(), disconnect: jest.fn() };
  const windowRef = {
    requestAnimationFrame: jest.fn(() => 1),
    cancelAnimationFrame: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    ResizeObserver: jest.fn((callback) => {
      onResize = callback;
      return observer;
    }),
  };
  const renderer = { render: jest.fn(), setSize: jest.fn() };
  const camera = { updateProjectionMatrix: jest.fn() };
  const container = { clientWidth: 1000, clientHeight: 500 };
  const stop = createRadarRenderLoop({ renderer, scene: {}, camera, container, windowRef });

  container.clientWidth = 800;
  onResize();
  expect(renderer.setSize).toHaveBeenLastCalledWith(800, 500);
  expect(camera.aspect).toBe(1.6);
  stop();
  expect(observer.observe).toHaveBeenCalledWith(container);
  expect(observer.disconnect).toHaveBeenCalled();
});
