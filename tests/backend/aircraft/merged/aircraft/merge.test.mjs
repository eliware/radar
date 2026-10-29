import { expect, test } from "@jest/globals";
import { mergeAircraftRecord } from "../../../../../src/backend/aircraft/merged/aircraft/merge.mjs";

test("merges the remote-only record and sorts missing distances last", () => {
  expect(mergeAircraftRecord({ remote: { icao: "ABC" } }, 0, 8000)).toEqual({
    icao: "ABC",
    remoteOnly: true,
  });
});

test("keeps fresh local data primary and falls back to remote fields", () => {
  expect(
    mergeAircraftRecord(
      {
        local: { icao: "ABC", lastSeen: 950, callsign: "", altitudeFeet: 1000 },
        remote: { icao: "ABC", lastSeen: 900, callsign: "RPA1", remoteOnly: true },
      },
      1000,
      100,
    ),
  ).toEqual({
    icao: "ABC",
    lastSeen: 950,
    callsign: "RPA1",
    altitudeFeet: 1000,
    remoteOnly: false,
  });
});

test("selects a newer remote record when local data is stale", () => {
  expect(
    mergeAircraftRecord(
      {
        local: { icao: "ABC", lastSeen: 700, callsign: "LOCAL" },
        remote: { icao: "ABC", lastSeen: 900, callsign: "REMOTE", remoteOnly: true },
      },
      1000,
      100,
    ),
  ).toMatchObject({ callsign: "REMOTE", remoteOnly: false });
});

test("merges local data when no remote fallback exists", () => {
  expect(mergeAircraftRecord({ local: { icao: "ABC", callsign: "LOCAL" } }, 1000, 100)).toEqual({
    icao: "ABC",
    callsign: "LOCAL",
    remoteOnly: false,
  });
});
