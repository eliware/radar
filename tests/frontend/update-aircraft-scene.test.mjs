import { expect, jest, test } from "@jest/globals";
import { createAircraftSceneUpdater } from "../../src/frontend/update-aircraft-scene.mjs";

function makeUpdater({ autoZoom = true, position = { x: 3, y: 0, z: 4 } } = {}) {
  const targets = {
    update: jest.fn(() => ["OLD"]),
    removeRemoteOnlyExcept: jest.fn(() => ["REMOTE-OLD"]),
    distances: jest.fn(() => [30]),
  };
  const trails = { add: jest.fn(), remove: jest.fn() };
  const radarCamera = { range: jest.fn(() => 20), setRange: jest.fn() };
  const update = createAircraftSceneUpdater({
    location: { latitude: 43, longitude: -70 },
    elevationFeet: 300,
    targets,
    trails,
    radarCamera,
    isAutoZoom: () => autoZoom,
  });
  return { update, targets, trails, radarCamera, position };
}

test("updates target range, trails, and auto-zoom for a valid aircraft", () => {
  const state = makeUpdater();
  state.update({ icao: "ABC123", latitude: 43.1, longitude: -70 });
  expect(state.targets.update).toHaveBeenCalledWith(
    { icao: "ABC123", latitude: 43.1, longitude: -70 },
    expect.any(Number),
  );
  expect(state.trails.remove).toHaveBeenCalledWith(["OLD"]);
  expect(state.trails.add).toHaveBeenCalledWith("ABC123", expect.any(Object));
  expect(state.radarCamera.setRange).toHaveBeenCalledWith(35);
});

test("skips invalid aircraft and keeps manual zoom unchanged", () => {
  const invalid = makeUpdater();
  invalid.update({ icao: "BAD000", latitude: undefined, longitude: -70 });
  expect(invalid.targets.update).not.toHaveBeenCalled();

  const manual = makeUpdater({ autoZoom: false });
  manual.update({ icao: "DEF456", latitude: 43.1, longitude: -70 });
  expect(manual.trails.add).toHaveBeenCalledWith("DEF456", expect.any(Object));
  expect(manual.targets.distances).not.toHaveBeenCalled();
  expect(manual.radarCamera.setRange).not.toHaveBeenCalled();
});

test("keeps the current camera range when target range does not change", () => {
  const state = makeUpdater();
  state.targets.distances.mockReturnValue([15]);
  state.update({ icao: "SAME00", latitude: 43.1, longitude: -70 });
  expect(state.radarCamera.setRange).not.toHaveBeenCalled();
});

test("updates remote-only targets without auto-zoom and removes missing remote targets", () => {
  const state = makeUpdater();
  state.update.updateRemote([
    { icao: "REMOTE", latitude: 43.1, longitude: -70, remoteOnly: true },
    { icao: "LOCAL", latitude: 43.2, longitude: -70, remoteOnly: false },
  ]);
  expect(state.targets.removeRemoteOnlyExcept).toHaveBeenCalledWith(["REMOTE"]);
  expect(state.targets.update).toHaveBeenCalledWith(
    expect.objectContaining({ icao: "REMOTE", remoteOnly: true }),
    expect.any(Number),
  );
  expect(state.radarCamera.setRange).not.toHaveBeenCalled();
  expect(state.trails.remove).toHaveBeenCalledWith(["REMOTE-OLD"]);
});
