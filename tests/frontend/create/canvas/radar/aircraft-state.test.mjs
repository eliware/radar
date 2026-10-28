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
    expect(tracker.items().get("A").receivedAt).toBe(1_000_000);
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
  const state = { autoZoom: true, range: 20 };
  const tracker = createCanvasRadarAircraftState({ latitude: 43, longitude: -70 }, state, draw);
  tracker.updateRemote([
    { icao: "REMOTE", latitude: 43.1, longitude: -68.5, remoteOnly: true },
    { icao: "LOCAL", latitude: 43.2, longitude: -70, remoteOnly: false },
    { icao: "BAD", latitude: Number.NaN, longitude: -70, remoteOnly: true },
  ]);
  expect(tracker.targets.items().has("REMOTE")).toBe(true);
  expect(state.range).toBe(20);
  expect(tracker.targets.items().has("LOCAL")).toBe(false);
  tracker.update({ icao: "LOCAL", latitude: 43.5, longitude: -70 });
  expect(state.range).toBeLessThan(50);
  tracker.updateRemote([]);
  expect(tracker.targets.items().has("REMOTE")).toBe(false);
  expect(draw).toHaveBeenCalledTimes(3);
});

test("batches Canvas drawing and trail cleanup while applying a snapshot", () => {
  const state = { autoZoom: true, range: 20, defaultRangeNm: 20 };
  const draw = jest.fn();
  const tracker = createCanvasRadarAircraftState({ latitude: 43, longitude: -70 }, state, draw);
  tracker.update({ icao: "OLD", latitude: 43, longitude: -69 });
  tracker.updateSnapshot([{ icao: "NEW", latitude: 43.1, longitude: -69 }], 25);
  expect(tracker.trails.get("OLD")).toEqual([]);
  expect(tracker.trails.get("NEW")).toHaveLength(1);
  expect(draw).toHaveBeenCalledTimes(2);
  state.autoZoom = false;
  tracker.updateSnapshot(null, Number.NaN);
  expect(draw).toHaveBeenCalledTimes(3);
});
