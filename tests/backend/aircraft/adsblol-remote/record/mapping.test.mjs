import { expect, test } from "@jest/globals";
import { mapRemoteAircraftRecord } from "../../../../../src/backend/aircraft/adsblol-remote/record/mapping.mjs";

const identity = { icao: "ABC123", latitude: 43.1, longitude: -70.2, ageSeconds: 1.5 };

test("adds identity, receipt time, and remote source to a record", () => {
  expect(mapRemoteAircraftRecord({}, identity, 10_000)).toEqual({
    icao: "ABC123",
    latitude: 43.1,
    longitude: -70.2,
    lastSeen: 8_500,
    remoteOnly: true,
  });
});
