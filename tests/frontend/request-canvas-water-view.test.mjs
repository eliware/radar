import { expect, jest, test } from "@jest/globals";
import { createCanvasWaterViewRequester } from "../../src/frontend/request-canvas-water-view.mjs";

test("loads each new Canvas view once and updates paths when data arrives", () => {
  const loader = { load: jest.fn() };
  const redraw = jest.fn();
  const data = { paths: [] };
  const canvas = { clientWidth: 200, clientHeight: 100 };
  const state = { range: 20, rotation: Math.PI / 2, offsetX: 5, offsetY: 0 };
  const requester = createCanvasWaterViewRequester(
    { latitude: 43, longitude: -70 },
    canvas,
    state,
    loader,
    data,
    redraw,
  );

  requester.update();
  const [center, range, onPaths] = loader.load.mock.calls[0];
  expect(center.latitude).toBeCloseTo(43 + 5 / 132);
  expect(center.longitude).toBeCloseTo(-70);
  expect(range).toBe(20);
  const paths = [[{ latitude: 43, longitude: -70 }]];
  onPaths(paths);
  expect(data.paths).toBe(paths);
  expect(redraw).toHaveBeenCalledTimes(1);
  requester.update();
  expect(loader.load).toHaveBeenCalledTimes(1);
  state.range = 30;
  requester.update();
  expect(loader.load).toHaveBeenCalledTimes(2);
});

test("does not request a view without a home location", () => {
  const loader = { load: jest.fn() };
  const requester = createCanvasWaterViewRequester(
    null,
    { clientWidth: 200, clientHeight: 200 },
    { range: 20, rotation: 0, offsetX: 0, offsetY: 0 },
    loader,
    { paths: [] },
    jest.fn(),
  );
  requester.update();
  expect(loader.load).not.toHaveBeenCalled();
});
