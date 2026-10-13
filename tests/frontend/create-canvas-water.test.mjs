import { expect, jest, test } from "@jest/globals";
import { createCanvasWater } from "../../src/frontend/create-canvas-water.mjs";

test("loads the visible map area once and redraws when tile data arrives", async () => {
  const button = fakeButton();
  const fetchRef = jest.fn(async () => ({ ok: true, json: async () => ({ tiles: [] }) }));
  const redraw = jest.fn();
  const canvas = { clientWidth: 200, clientHeight: 200 };
  const state = { range: 20, rotation: 0, offsetX: 0, offsetY: 0 };
  const data = { paths: [], visible: true, isVisible: () => data.visible };
  const water = createCanvasWater(
    { querySelector: () => button },
    { fetch: fetchRef },
    { latitude: 43, longitude: -70 },
    canvas,
    state,
    data,
    redraw,
  );
  water.update();
  await new Promise((resolve) => setTimeout(resolve, 0));
  water.update();
  expect(fetchRef).toHaveBeenCalledTimes(1);
  expect(redraw).toHaveBeenCalled();
  button.handlers.click();
  expect(data.visible).toBe(false);
  canvas.clientWidth = 0;
  state.offsetX = 5;
  water.update();
  water.destroy();
});

test("does not request tiles without a home location", () => {
  const fetchRef = jest.fn();
  const water = createCanvasWater(
    { querySelector: () => null },
    { fetch: fetchRef },
    null,
    {},
    { range: 20 },
    { paths: [], visible: true },
    jest.fn(),
  );
  water.update();
  expect(fetchRef).not.toHaveBeenCalled();
  water.destroy();
});

function fakeButton() {
  const handlers = {};
  return {
    handlers,
    setAttribute: jest.fn(),
    addEventListener: (name, callback) => {
      handlers[name] = callback;
    },
    removeEventListener: (name) => {
      delete handlers[name];
    },
  };
}
