import { beforeEach, expect, jest, test } from "@jest/globals";
import { registerAircraftSceneMocks } from "../../../test-fixtures/aircraft-scene-mocks.mjs";

const mocks = registerAircraftSceneMocks(jest);
const { createAircraftScene } = await import("../../../src/frontend/aircraft/scene.mjs");
const container = { replaceChildren: jest.fn() };
const windowRef = {};
const location = { latitude: 43, longitude: -70 };
const createView = () =>
  createAircraftScene({ container, location, elevationFeet: 300, windowRef });

beforeEach(() => jest.clearAllMocks());

test("wires scene services, reports connection changes, and publishes references", () => {
  const view = createView();
  expect(view.getViewportBounds).toEqual(expect.any(Function));
  expect(view.visibleRadiusNm).toEqual(expect.any(Function));
  const loop = mocks.factories.createAircraftRadarLoop.mock.calls[0][0];
  const cameraOptions = mocks.factories.createRadarCamera.mock.calls[0][0];
  expect(mocks.factories.createRadarStage).toHaveBeenCalledWith(
    expect.anything(),
    container,
    windowRef,
  );
  expect(mocks.factories.createRadarCamera).toHaveBeenCalledWith(
    expect.objectContaining({ camera: mocks.camera, controls: mocks.controls }),
  );
  expect(mocks.radarCamera.setRange).toHaveBeenCalledWith(20);
  expect(mocks.radarCamera.setRotation).toHaveBeenCalledWith(0);
  expect(loop).toEqual(
    expect.objectContaining({ targets: mocks.targets, renderer: mocks.renderer }),
  );
  expect(loop.isAutoZoom()).toBe(true);
  expect(loop.isConnected()).toBe(false);
  view.setConnected(true);
  expect(mocks.homeConnected).toHaveBeenCalledWith(true);
  expect(loop.isConnected()).toBe(true);
  view.updateAirports([]);
  view.updateNavaids([]);
  view.updateBoundaries([]);
  expect(mocks.referenceUpdates.updateAirports).toHaveBeenCalledWith([]);
  expect(mocks.airspace.update).toHaveBeenCalledWith([]);
  expect(mocks.referenceUpdates.updateNavaids).toHaveBeenCalledWith([]);
  expect(mocks.referenceUpdates.updateBoundaries).toHaveBeenCalledWith([]);
  const listener = jest.fn();
  const detach = view.onViewChange(listener);
  expect(mocks.orbitState.onViewChange).toHaveBeenCalledWith(listener);
  expect(detach).toEqual(expect.any(Function));
  detach();
  cameraOptions.onRangeChange(40);
  expect(mocks.updateRings).toHaveBeenCalledWith(40);
  cameraOptions.onManualZoom();
  expect(loop.isAutoZoom()).toBe(false);
});

test("uses the browser window when no window reference is passed", () => {
  const previousWindow = globalThis.window;
  globalThis.window = windowRef;
  try {
    createAircraftScene({ container, location, elevationFeet: 300 });
    expect(mocks.factories.createRadarStage).toHaveBeenCalledWith(
      expect.anything(),
      container,
      windowRef,
    );
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test("wires aircraft updates to the scene update workflow", () => {
  const view = createView();
  const aircraft = { icao: "ABC123", latitude: 43.1, longitude: -70 };
  const options = mocks.factories.createAircraftSceneUpdater.mock.calls[0][0];
  expect(options).toEqual(
    expect.objectContaining({
      location,
      elevationFeet: 300,
      targets: mocks.targets,
      trails: mocks.trails,
      radarCamera: mocks.radarCamera,
    }),
  );
  expect(options.isAutoZoom()).toBe(true);
  view.update(aircraft);
  expect(mocks.updateAircraft).toHaveBeenCalledWith(aircraft);
});

test("restores auto-zoom when the view resets", () => {
  const view = createView();
  const loop = mocks.factories.createAircraftRadarLoop.mock.calls.at(-1)[0];
  mocks.factories.createRadarCamera.mock.calls.at(-1)[0].onManualZoom();
  expect(loop.isAutoZoom()).toBe(false);
  mocks.targets.localDistances.mockReturnValue([40]);
  view.reset();
  expect(mocks.radarCamera.setRange).toHaveBeenLastCalledWith(45);
  expect(mocks.radarCamera.setRotation).toHaveBeenLastCalledWith(0);
  expect(loop.isAutoZoom()).toBe(true);
});

test("starts and resets with configured radar defaults", () => {
  createAircraftScene({
    container,
    location,
    elevationFeet: 300,
    defaultRangeNm: 25,
    defaultRotationDegrees: 140,
    windowRef,
  });
  expect(mocks.radarCamera.setRange).toHaveBeenCalledWith(25);
  expect(mocks.radarCamera.setRotation).toHaveBeenCalledWith((140 * Math.PI) / 180);
});

test("releases scene resources", () => {
  createView().destroy();
  expect(mocks.stopRadarLoops).toHaveBeenCalledTimes(1);
  expect(mocks.airspace.dispose).toHaveBeenCalledTimes(1);
  expect(mocks.overlay.destroy).toHaveBeenCalledTimes(1);
  expect(mocks.radarCamera.dispose).toHaveBeenCalledTimes(1);
  expect(mocks.controlsDispose).toHaveBeenCalledTimes(1);
  expect(container.replaceChildren).toHaveBeenCalledTimes(1);
});
