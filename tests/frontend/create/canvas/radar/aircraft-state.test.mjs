import { expect, jest, test } from "@jest/globals";
import { createCanvasRadarAircraftState } from "../../../../../src/frontend/create/canvas/radar/aircraft-state.mjs";

test("coordinates target updates, snapshots, remote records, auto-zoom, and drawing", () => {
  const state = { autoZoom: true, defaultRangeNm: 20, range: 20 };
  const draw = jest.fn();
  const tracker = createCanvasRadarAircraftState({ latitude: 43, longitude: -70 }, state, draw);

  tracker.update({ icao: "BAD", latitude: Number.NaN, longitude: -70 });
  expect(draw).not.toHaveBeenCalled();
  tracker.update({ icao: "LOCAL", latitude: 43, longitude: -69 });
  tracker.updateRemote([{ icao: "REMOTE", latitude: 43, longitude: -68, remoteOnly: true }]);
  tracker.updateSnapshot(
    [
      { icao: "LOCAL", latitude: 43, longitude: -69 },
      { icao: "REMOTE", latitude: 43, longitude: -68, remoteOnly: true },
    ],
    25,
  );
  expect(tracker.targets.items().has("LOCAL")).toBe(true);
  expect(tracker.targets.items().has("REMOTE")).toBe(true);
  expect(tracker.items().get("LOCAL").receivedAt).toEqual(expect.any(Number));
  expect(state.range).toBe(30);
  tracker.updateSnapshot(null, Number.NaN);
  expect(tracker.targets.items().size).toBe(0);
  expect(draw).toHaveBeenCalledTimes(4);
});
