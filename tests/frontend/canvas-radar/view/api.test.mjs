import { expect, jest, test } from "@jest/globals";
import { createCanvasRadarViewApi } from "../../../../src/frontend/canvas-radar/view/api.mjs";

test("composes view operations and destroys owned resources", () => {
  const draw = jest.fn();
  const state = { connected: false, range: 20, offsetX: 0, offsetY: 0, rotation: 0 };
  const aircraftState = {
    update: jest.fn(),
    updateSnapshot: jest.fn(),
    updateRemote: jest.fn(),
  };
  const layerUpdates = { setVisible: jest.fn(), isLocalOnly: jest.fn(() => true) };
  const layers = { ils: layerUpdates, aircraft: layerUpdates, destroy: jest.fn() };
  const references = {
    updates: (onAirports, onChange) => ({
      updateAirports(items) {
        onAirports(items);
        onChange();
      },
    }),
  };
  const viewState = { reset: jest.fn(), range: jest.fn(() => 20) };
  const detachEvents = jest.fn();
  const waterLayer = { destroy: jest.fn() };
  const viewChanges = { clear: jest.fn() };
  const surface = { destroy: jest.fn() };
  const api = createCanvasRadarViewApi({
    state,
    aircraftState,
    layers,
    references,
    viewState,
    canvas: { clientWidth: 200, clientHeight: 100 },
    draw,
    detachEvents,
    waterLayer,
    viewChanges,
    surface,
  });
  expect(api.mode).toBe("2D");
  expect(api.isLocalOnly()).toBe(true);
  expect(api.range()).toBe(20);
  api.updateAirports([]);
  draw.mockClear();
  api.setConnected(true);
  expect(state.connected).toBe(true);
  expect(draw).toHaveBeenCalledTimes(1);
  expect(api.getViewportBounds().visibleRadiusNm).toEqual(expect.any(Number));
  expect(api.visibleRadiusNm()).toBe(api.getViewportBounds().visibleRadiusNm);
  api.destroy();
  expect(detachEvents).toHaveBeenCalledTimes(1);
  expect(layers.destroy).toHaveBeenCalledTimes(1);
  expect(waterLayer.destroy).toHaveBeenCalledTimes(1);
  expect(viewChanges.clear).toHaveBeenCalledTimes(1);
  expect(surface.destroy).toHaveBeenCalledTimes(1);
});
