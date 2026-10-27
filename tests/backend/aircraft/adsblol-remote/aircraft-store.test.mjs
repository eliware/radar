import { expect, test } from "@jest/globals";
import { createAdsbLolAircraftStore } from "../../../../src/backend/aircraft/adsblol-remote/aircraft-store.mjs";

const location = { latitude: 43.8, longitude: -70.4 };
const record = (hex = "ABC123") => ({
  hex,
  flight: "RPA1",
  lat: 43.9,
  lon: -70.3,
  seen_pos: 0,
});

test("stores normalized remote aircraft and discards invalid records", () => {
  const store = createAdsbLolAircraftStore({ location });
  store.update(record());
  store.update({ ...record("BAD"), lat: "43" });
  expect(store.list()).toMatchObject([{ icao: "ABC123", callsign: "RPA1" }]);
  expect(store.list()).toHaveLength(1);
});

test("expires old tracks and clears records", () => {
  let now = 10_000;
  const store = createAdsbLolAircraftStore({ location, clock: () => now });
  store.update(record());
  now += 120_001;
  expect(store.list()).toEqual([]);
  store.update(record());
  store.clear();
  expect(store.list()).toEqual([]);
});

test("accepts route lookups with the default update callback", async () => {
  const store = createAdsbLolAircraftStore({
    location,
    lookup: { getCallsignRoute: async () => ({ origin: "KBOS" }) },
  });
  store.update(record());
  await Promise.resolve();
  expect(store.list()).toMatchObject([{ origin: "KBOS" }]);
});
