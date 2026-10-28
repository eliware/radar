import { expect, test } from "@jest/globals";
import { createAdsbLolTrackStore } from "../../../../src/backend/aircraft/adsblol-remote/track-store.mjs";

const location = { latitude: 43.8, longitude: -70.4 };
const record = (hex = "ABC123") => ({
  hex,
  flight: "RPA1",
  lat: 43.9,
  lon: -70.3,
  seen_pos: 0,
});

test("stores normalized tracks and discards invalid records", () => {
  const tracks = createAdsbLolTrackStore({ location });
  tracks.update(record());
  tracks.update({ ...record("BAD"), lat: "43" });
  expect(tracks.list()).toMatchObject([{ icao: "ABC123", callsign: "RPA1" }]);
  expect(tracks.list()).toHaveLength(1);
});

test("preserves route fields only while a track keeps the same callsign", () => {
  const tracks = createAdsbLolTrackStore({ location });
  const mapped = tracks.update(record());
  tracks.set(mapped.icao, { ...mapped, origin: "KBOS" });
  tracks.update(record());
  expect(tracks.get(mapped.icao).origin).toBe("KBOS");
  tracks.update({ ...record(), flight: "RPA2" });
  expect(tracks.get(mapped.icao).origin).toBeUndefined();
});
