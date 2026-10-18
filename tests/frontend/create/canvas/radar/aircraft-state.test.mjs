import { expect, jest, test } from "@jest/globals";
import { createCanvasRadarAircraftState } from "../../../../../src/frontend/create/canvas/radar/aircraft-state.mjs";

test("tracks valid aircraft, sets auto-zoom, and prunes stale targets", () => {
  jest.useFakeTimers().setSystemTime(1_000_000);
  try {
    const state = { autoZoom: true, range: 20 };
    const draw = jest.fn();
    const tracker = createCanvasRadarAircraftState({ latitude: 43, longitude: -70 }, state, draw);
    expect(tracker.update({ icao: "BAD", latitude: Number.NaN, longitude: -70 })).toBeUndefined();
    expect(draw).not.toHaveBeenCalled();
    tracker.update({ icao: "A", latitude: 43, longitude: -69 });
    expect(state.range).toBeGreaterThan(20);
    expect(tracker.targets.items().has("A")).toBe(true);
    expect(tracker.trails.get("A")).toHaveLength(1);
    jest.setSystemTime(1_120_001);
    tracker.update({ icao: "B", latitude: 43, longitude: -69.5 });
    expect(tracker.targets.items().has("A")).toBe(false);
    expect(tracker.trails.get("A")).toEqual([]);
    expect(draw).toHaveBeenCalledTimes(2);
  } finally {
    jest.useRealTimers();
  }
});

test("keeps the current range when auto-zoom is disabled", () => {
  const state = { autoZoom: false, range: 24 };
  const draw = jest.fn();
  const tracker = createCanvasRadarAircraftState({ latitude: 43, longitude: -70 }, state, draw);
  tracker.update({ icao: "A", latitude: 43, longitude: -69 });
  expect(state.range).toBe(24);
  expect(draw).toHaveBeenCalledTimes(1);
});

test("tracks remote-only aircraft and removes stale remote targets", () => {
  const draw = jest.fn();
  const tracker = createCanvasRadarAircraftState(
    { latitude: 43, longitude: -70 },
    { autoZoom: true, range: 20 },
    draw,
  );
  tracker.updateRemote([
    { icao: "REMOTE", latitude: 43.1, longitude: -70, remoteOnly: true },
    { icao: "LOCAL", latitude: 43.2, longitude: -70, remoteOnly: false },
    { icao: "BAD", latitude: Number.NaN, longitude: -70, remoteOnly: true },
  ]);
  expect(tracker.targets.items().has("REMOTE")).toBe(true);
  expect(tracker.targets.items().has("LOCAL")).toBe(false);
  tracker.updateRemote([]);
  expect(tracker.targets.items().has("REMOTE")).toBe(false);
  expect(draw).toHaveBeenCalledTimes(2);
});
