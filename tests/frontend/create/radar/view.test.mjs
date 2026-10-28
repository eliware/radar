import { expect, jest, test } from "@jest/globals";

const createAircraftScene = jest.fn();
const createCanvasRadarView = jest.fn();
jest.unstable_mockModule("../../../../src/frontend/aircraft/scene.mjs", () => ({
  createAircraftScene,
}));
jest.unstable_mockModule("../../../../src/frontend/create/radar/scene-loader.mjs", () => ({
  loadAircraftScene: (...args) => createAircraftScene(...args),
}));
jest.unstable_mockModule("../../../../src/frontend/canvas-radar/view.mjs", () => ({
  createCanvasRadarView,
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
  expect(createCanvasRadarView).not.toHaveBeenCalled();
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

test("uses Canvas when WebGL context creation fails", async () => {
  const view = { mode: "2D" };
  const args = {
    container: {},
    location: null,
    elevationFeet: 300,
    windowRef: {},
    onMode: jest.fn(),
  };
  createAircraftScene.mockImplementationOnce(() => {
    throw new Error("THREE.WebGLRenderer: Error creating WebGL context.");
  });
  createCanvasRadarView.mockReturnValueOnce(view);
  expect(await createRadarView(args)).toBe(view);
  expect(createCanvasRadarView).toHaveBeenCalledWith({
    container: args.container,
    location: null,
    elevationFeet: 300,
    defaultRangeNm: undefined,
    defaultRotationDegrees: undefined,
    windowRef: args.windowRef,
  });
  expect(args.onMode).toHaveBeenCalledWith("2D");
});

test("does not hide unrelated scene errors", async () => {
  createAircraftScene.mockImplementationOnce(() => {
    throw new Error("broken scene setup");
  });
  await expect(
    createRadarView({ container: {}, location: null, elevationFeet: 300, windowRef: {} }),
  ).rejects.toThrow("broken scene setup");
});
