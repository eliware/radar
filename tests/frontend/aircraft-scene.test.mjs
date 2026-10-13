import { beforeEach, expect, jest, test } from "@jest/globals";
import { registerAircraftSceneMocks } from "../../test-fixtures/aircraft-scene-mocks.mjs";

const mocks = registerAircraftSceneMocks(jest);
const { createAircraftScene } = await import("../../src/frontend/aircraft-scene.mjs");
const container = { replaceChildren: jest.fn() };
const windowRef = {};
const location = { latitude: 43, longitude: -70 };
const createView = () =>
  createAircraftScene({ container, location, elevationFeet: 300, windowRef });

beforeEach(() => jest.clearAllMocks());

test("wires scene services and reports connection changes", () => {
  const view = createView();
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
  expect(loop).toEqual(
    expect.objectContaining({ targets: mocks.targets, renderer: mocks.renderer }),
  );
  expect(loop.isAutoZoom()).toBe(true);
  expect(loop.isConnected()).toBe(false);
  view.setConnected(true);
  expect(mocks.homeConnected).toHaveBeenCalledWith(true);
  expect(loop.isConnected()).toBe(true);
  cameraOptions.onRangeChange(40);
  expect(mocks.updateRings).toHaveBeenCalledWith(40);
  expect(mocks.map.setRange).toHaveBeenCalledWith(40);
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

test("updates targets and applies auto-zoom only to valid aircraft", () => {
  const view = createView();
  const aircraft = { icao: "ABC123", latitude: 43.1, longitude: -70 };
  mocks.targets.distances.mockReturnValue([30]);
  view.update(aircraft);
  expect(mocks.targets.update).toHaveBeenCalledWith(aircraft, expect.any(Number));
  expect(mocks.trails.add).toHaveBeenCalledWith("ABC123", expect.any(Object));
  expect(mocks.radarCamera.setRange).toHaveBeenLastCalledWith(35);
  view.update({ ...aircraft, icao: "ABC124" });
  expect(mocks.radarCamera.setRange).toHaveBeenCalledTimes(2);
  expect(view.update({ icao: "BAD000", latitude: undefined, longitude: -70 })).toBeUndefined();
  expect(mocks.targets.update).toHaveBeenCalledTimes(2);
  const loop = mocks.factories.createAircraftRadarLoop.mock.calls.at(-1)[0];
  mocks.factories.createRadarCamera.mock.calls.at(-1)[0].onManualZoom();
  mocks.targets.distances.mockReturnValue([70]);
  view.update({ icao: "DEF456", latitude: 43.2, longitude: -70 });
  expect(loop.isAutoZoom()).toBe(false);
  expect(mocks.radarCamera.setRange).toHaveBeenCalledTimes(2);
});

test("publishes reference updates and restores auto-zoom on reset", () => {
  const view = createView();
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
  mocks.scene.rotation.y = 2;
  mocks.targets.distances.mockReturnValue([40]);
  view.reset();
  expect(mocks.scene.rotation.y).toBe(0);
  expect(mocks.radarCamera.setRange).toHaveBeenLastCalledWith(45);
  mocks.factories.createRadarCamera.mock.calls.at(-1)[0].onManualZoom();
  view.reset();
  expect(mocks.factories.createAircraftRadarLoop.mock.calls[0][0].isAutoZoom()).toBe(true);
});

test("releases scene resources", () => {
  createView().destroy();
  expect(mocks.stopRadarLoops).toHaveBeenCalledTimes(1);
  expect(mocks.airspace.dispose).toHaveBeenCalledTimes(1);
  expect(mocks.map).toHaveBeenCalledTimes(1);
  expect(mocks.overlay.destroy).toHaveBeenCalledTimes(1);
  expect(mocks.radarCamera.dispose).toHaveBeenCalledTimes(1);
  expect(mocks.controls.dispose).toHaveBeenCalledTimes(1);
  expect(container.replaceChildren).toHaveBeenCalledTimes(1);
});
