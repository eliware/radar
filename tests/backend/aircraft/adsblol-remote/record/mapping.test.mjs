import { expect, test } from "@jest/globals";
import { mapRemoteAircraftRecord } from "../../../../../src/backend/aircraft/adsblol-remote/record/mapping.mjs";

const identity = { icao: "ABC123", latitude: 43.1, longitude: -70.2, ageSeconds: 1.5 };

test("maps remote fields and trims text values", () => {
  expect(
    mapRemoteAircraftRecord(
      {
        alt_baro: 12_000,
        gs: 240,
        track: 85,
        baro_rate: 500,
        flight: " RPA3471 ",
        t: " E75L ",
        squawk: " 7700 ",
        emergency: " general ",
      },
      identity,
      10_000,
    ),
  ).toEqual({
    icao: "ABC123",
    latitude: 43.1,
    longitude: -70.2,
    altitudeFeet: 12_000,
    groundSpeedKnots: 240,
    trackDegrees: 85,
    verticalRateFeetPerMinute: 500,
    callsign: "RPA3471",
    aircraftTypeCode: "E75L",
    squawk: "7700",
    emergency: "general",
    lastSeen: 8_500,
    remoteOnly: true,
  });
});

test("uses alternative numeric fields and omits invalid optional data", () => {
  expect(
    mapRemoteAircraftRecord(
      { alt_geom: 9_000, true_heading: 90, geom_rate: -200, flight: 7, gs: "240" },
      identity,
      10_000,
    ),
  ).toMatchObject({ altitudeFeet: 9_000, trackDegrees: 90, verticalRateFeetPerMinute: -200 });
  expect(
    mapRemoteAircraftRecord(
      { alt_geom: Number.NaN, track: Number.NaN, flight: "   " },
      identity,
      10_000,
    ),
  ).not.toHaveProperty("altitudeFeet");
});
