import { expect, jest, test } from "@jest/globals";
import { normalizeRemoteAircraft } from "../../../../src/backend/aircraft/adsblol-remote/normalize.mjs";

const location = { latitude: 43, longitude: -70 };

test("maps a fresh re-api record to Radar aircraft fields and source age", () => {
  expect(
    normalizeRemoteAircraft(
      {
        hex: "abc123",
        lat: 43.1,
        lon: -70.2,
        seen: 0.4,
        seen_pos: 1.5,
        alt_baro: 12_000,
        gs: 240,
        track: 85,
        baro_rate: 500,
        flight: " RPA3471 ",
        t: "E75L",
        squawk: "7700",
        emergency: "general",
      },
      location,
      10_000,
    ),
  ).toMatchObject({
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

test("maps geometric altitude and falls back to general observation age", () => {
  expect(
    normalizeRemoteAircraft(
      { hex: "ABC123", lat: 43, lon: -70, alt_geom: 9000, seen_pos: 2 },
      location,
      5000,
    ),
  ).toMatchObject({ altitudeFeet: 9000, lastSeen: 3000 });
});

test("uses the current time when no observation time is supplied", () => {
  const now = jest.spyOn(Date, "now").mockReturnValue(5000);
  const aircraft = normalizeRemoteAircraft({ hex: "ABC123", lat: 43, lon: -70, seen: 0 }, location);

  expect(aircraft.lastSeen).toBe(5000);
  now.mockRestore();
});

test("returns null when remote record validation fails", () => {
  expect(normalizeRemoteAircraft({ hex: "", lat: 43, lon: -70 }, location, 5000)).toBeNull();
});
