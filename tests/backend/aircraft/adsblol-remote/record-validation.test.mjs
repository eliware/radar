import { expect, test } from "@jest/globals";
import { validateRemoteAircraftRecord } from "../../../../src/backend/aircraft/adsblol-remote/record-validation.mjs";

const valid = { hex: "abc123", lat: 43, lon: -70, seen: 2 };

test("returns normalized identity, position, and selected observation age", () => {
  expect(validateRemoteAircraftRecord(valid)).toEqual({
    icao: "ABC123",
    latitude: 43,
    longitude: -70,
    ageSeconds: 2,
  });
  expect(validateRemoteAircraftRecord({ ...valid, seen_pos: 1 })).toMatchObject({ ageSeconds: 1 });
});

test("rejects records without identity, valid coordinates, or an observation age", () => {
  expect(validateRemoteAircraftRecord(null)).toBeNull();
  expect(validateRemoteAircraftRecord({ ...valid, hex: " " })).toBeNull();
  expect(validateRemoteAircraftRecord({ ...valid, lat: Number.NaN })).toBeNull();
  expect(validateRemoteAircraftRecord({ ...valid, lon: "-70" })).toBeNull();
  expect(validateRemoteAircraftRecord({ ...valid, seen: undefined })).toBeNull();
});

test("rejects negative and stale observation ages", () => {
  expect(validateRemoteAircraftRecord({ ...valid, seen: -1 })).toBeNull();
  expect(validateRemoteAircraftRecord({ ...valid, seen: 120.001 })).toBeNull();
  expect(validateRemoteAircraftRecord({ ...valid, seen: 200, seen_pos: 0 })).not.toBeNull();
});
