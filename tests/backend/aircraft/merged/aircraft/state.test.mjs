import { expect, test } from "@jest/globals";
import { createMergedAircraftState } from "../../../../../src/backend/aircraft/merged/aircraft/state.mjs";

test("coordinates source updates and reconciles replaced entries", () => {
  const state = createMergedAircraftState();
  state.replaceRemote([{ icao: "REMOTE1" }, { icao: " " }]);
  state.replaceLocal([{ icao: "LOCAL1" }]);
  state.setLocal({ icao: "LOCAL2" });
  expect(state.list().map(({ icao }) => icao)).toEqual(["REMOTE1", "LOCAL1", "LOCAL2"]);
  state.replaceLocal([]);
  expect(state.list()).toEqual([{ icao: "REMOTE1", remoteOnly: true }]);
  state.replaceRemote([]);
  expect(state.list()).toEqual([]);
});

test("uses newer remote fields while retaining the local source classification", () => {
  let now = 20_000;
  const state = createMergedAircraftState({ clock: () => now, localFreshnessMs: 8_000 });
  state.replaceLocal([
    { icao: "ABC123", latitude: 43, longitude: -70, callsign: "LOCAL", lastSeen: 17_000 },
  ]);
  state.replaceRemote([
    {
      icao: "ABC123",
      latitude: 43.1,
      longitude: -70.1,
      aircraftTypeCode: "B712",
      callsign: "REMOTE",
      lastSeen: 19_000,
      remoteOnly: false,
    },
  ]);

  expect(state.list()[0]).toEqual(
    expect.objectContaining({ latitude: 43, longitude: -70, callsign: "LOCAL", remoteOnly: false }),
  );

  now = 26_000;
  state.replaceRemote([
    {
      icao: "ABC123",
      latitude: 43.2,
      longitude: -70.2,
      aircraftTypeCode: "B712",
      callsign: "REMOTE",
      lastSeen: 25_000,
      remoteOnly: true,
    },
  ]);
  expect(state.list()[0]).toEqual(
    expect.objectContaining({
      latitude: 43.2,
      longitude: -70.2,
      callsign: "REMOTE",
      aircraftTypeCode: "B712",
      remoteOnly: false,
    }),
  );
});
