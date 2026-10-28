import { expect, jest, test } from "@jest/globals";

const createAircraftScene = jest.fn();
const createRadarFallback = jest.fn();
jest.unstable_mockModule("../../../../src/frontend/aircraft/scene.mjs", () => ({
  createAircraftScene,
}));
jest.unstable_mockModule("../../../../src/frontend/create/radar/scene-loader.mjs", () => ({
  loadAircraftScene: (...args) => createAircraftScene(...args),
}));
jest.unstable_mockModule("../../../../src/frontend/create/radar/fallback.mjs", () => ({
  createRadarFallback,
}));
const { createRadarView } = await import("../../../../src/frontend/create/radar/view.mjs");

test("uses Three.js when WebGL starts", async () => {
  const view = { mode: "3D" };
  const onMode = jest.fn();
  createAircraftScene.mockReturnValueOnce(view);
  expect(
    await createRadarView({
      container: {},
      location: null,
      elevationFeet: 300,
      windowRef: {},
      onMode,
    }),
  ).toBe(view);
  expect(onMode).toHaveBeenCalledWith("3D");
});

test("does not require a view mode callback", async () => {
  createAircraftScene.mockReturnValueOnce({ mode: "3D" });
  expect(
    await createRadarView({ container: {}, location: null, elevationFeet: 300, windowRef: {} }),
  ).toEqual({
    mode: "3D",
  });
});

test("uses the browser window when callers omit it", async () => {
  globalThis.window = {};
  createAircraftScene.mockReturnValueOnce({ mode: "3D" });
  expect(await createRadarView({ container: {}, location: null, elevationFeet: 300 })).toEqual({
    mode: "3D",
  });
  delete globalThis.window;
});

test("selects the fallback view when scene loading fails", async () => {
  const error = new Error("WebGL context unavailable");
  const options = { container: {}, location: null, elevationFeet: 300, windowRef: {} };
  const fallback = { mode: "2D" };
  const onMode = jest.fn();
  createAircraftScene.mockRejectedValueOnce(error);
  createRadarFallback.mockReturnValueOnce(fallback);
  expect(await createRadarView({ ...options, onMode })).toBe(fallback);
  expect(createRadarFallback).toHaveBeenCalledWith(error, options);
  expect(onMode).toHaveBeenCalledWith("2D");
});
