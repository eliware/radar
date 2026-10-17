import { expect, jest, test } from "@jest/globals";
import { createCanvasRadarAircraftState } from "../../../../../src/frontend/create/canvas/radar/aircraft-state.mjs";

test("tracks valid aircraft, sets auto-zoom, and prunes stale targets", () => {
  let now = Date.now();
  const dateNow = jest.spyOn(Date, "now").mockImplementation(() => now);
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
    now += 120_001;
    tracker.update({ icao: "B", latitude: 43, longitude: -69.5 });
    expect(tracker.targets.items().has("A")).toBe(false);
    expect(tracker.trails.get("A")).toEqual([]);
    expect(draw).toHaveBeenCalledTimes(2);
  } finally {
    dateNow.mockRestore();
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
