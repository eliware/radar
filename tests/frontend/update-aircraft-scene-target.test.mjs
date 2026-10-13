import { expect, jest, test } from "@jest/globals";
import { updateAircraftSceneTarget } from "../../src/frontend/update-aircraft-scene-target.mjs";

function state(isAutoZoom = true, distances = [30], range = 20) {
  return {
    location: { latitude: 43, longitude: -70 },
    elevationFeet: 300,
    targets: { update: jest.fn(() => []), distances: jest.fn(() => distances) },
    trails: { add: jest.fn(), remove: jest.fn() },
    isAutoZoom: () => isAutoZoom,
    radarCamera: { range: () => range, setRange: jest.fn() },
  };
}

test("tracks a valid target, adds its trail, and updates auto-zoom", () => {
  const view = state();
  const aircraft = { icao: "ABC123", latitude: 43.1, longitude: -70 };
  updateAircraftSceneTarget(aircraft, view);
  expect(view.targets.update).toHaveBeenCalledWith(aircraft, expect.any(Number));
  expect(view.trails.remove).toHaveBeenCalledWith([]);
  expect(view.trails.add).toHaveBeenCalledWith("ABC123", expect.any(Object));
  expect(view.radarCamera.setRange).toHaveBeenCalledWith(35);
});

test("ignores invalid targets", () => {
  const view = state();
  updateAircraftSceneTarget({ icao: "BAD000" }, view);
  expect(view.targets.update).not.toHaveBeenCalled();
  expect(view.trails.add).not.toHaveBeenCalled();
});

test("does not change range after manual zoom or when range stays the same", () => {
  const manuallyZoomed = state(false);
  updateAircraftSceneTarget({ icao: "ABC123", latitude: 43.1, longitude: -70 }, manuallyZoomed);
  expect(manuallyZoomed.radarCamera.setRange).not.toHaveBeenCalled();
  const sameRange = state(true, [15], 20);
  updateAircraftSceneTarget({ icao: "ABC123", latitude: 43.1, longitude: -70 }, sameRange);
  expect(sameRange.radarCamera.setRange).not.toHaveBeenCalled();
});
