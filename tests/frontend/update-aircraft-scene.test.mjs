import { expect, jest, test } from "@jest/globals";
import { createAircraftSceneUpdater } from "../../src/frontend/update-aircraft-scene.mjs";

function makeUpdater({ autoZoom = true, position = { x: 3, y: 0, z: 4 } } = {}) {
  const targets = {
    update: jest.fn(() => ["OLD"]),
    removeRemoteOnlyExcept: jest.fn(() => ["REMOTE-OLD"]),
    retain: jest.fn(() => ["OUTSIDE"]),
    localDistances: jest.fn(() => [30]),
  };
  const trails = {
    add: jest.fn(),
    remove: jest.fn(),
    withReceivedAt: jest.fn((items) => items),
  };
  const radarCamera = { range: jest.fn(() => 20), setRange: jest.fn() };
  const update = createAircraftSceneUpdater({
    location: { latitude: 43, longitude: -70 },
    elevationFeet: 300,
    targets,
    trails,
    radarCamera,
    isAutoZoom: () => autoZoom,
    defaultRangeNm: 20,
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
  expect(state.trails.add).toHaveBeenCalledWith("ABC123", expect.any(Object), undefined);
  expect(state.radarCamera.setRange).toHaveBeenCalledWith(35);
});

test("composes display items from target records and trail timestamps", () => {
  const state = makeUpdater();
  const items = new Map([["ABC123", { icao: "ABC123" }]]);
  state.targets.items = jest.fn(() => items);
  expect(state.update.items()).toBe(items);
  expect(state.trails.withReceivedAt).toHaveBeenCalledWith(items);
});

test("skips invalid aircraft and keeps manual zoom unchanged", () => {
  const invalid = makeUpdater();
  invalid.update({ icao: "BAD000", latitude: undefined, longitude: -70 });
  expect(invalid.targets.update).not.toHaveBeenCalled();

  const manual = makeUpdater({ autoZoom: false });
  manual.update({ icao: "DEF456", latitude: 43.1, longitude: -70 });
  expect(manual.trails.add).toHaveBeenCalledWith("DEF456", expect.any(Object), undefined);
  expect(manual.targets.localDistances).not.toHaveBeenCalled();
  expect(manual.radarCamera.setRange).not.toHaveBeenCalled();
});

test("keeps the current camera range when target range does not change", () => {
  const state = makeUpdater();
  state.targets.localDistances.mockReturnValue([15]);
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

test("replaces snapshot targets and sets auto-zoom from local furthest distance", () => {
  const state = makeUpdater();
  state.update.updateSnapshot([{ icao: "IN", latitude: 43.1, longitude: -70 }], 25);
  expect(state.targets.retain).toHaveBeenCalledWith(["IN"]);
  expect(state.trails.remove).toHaveBeenCalledWith(["OUTSIDE"]);
  expect(state.radarCamera.setRange).toHaveBeenCalledWith(30);
});

test("skips invalid snapshot contents and avoids redundant range updates", () => {
  const state = makeUpdater();
  state.radarCamera.range.mockReturnValue(30);
  state.update.updateSnapshot(null, 25);
  expect(state.targets.retain).toHaveBeenCalledWith([]);
  expect(state.radarCamera.setRange).not.toHaveBeenCalled();
  const manual = makeUpdater({ autoZoom: false });
  manual.update.updateSnapshot([], Number.NaN);
  expect(manual.radarCamera.setRange).not.toHaveBeenCalled();
});
