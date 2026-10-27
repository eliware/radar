import { expect, jest, test } from "@jest/globals";
import { createAdsbLolAircraftStore } from "../../../../src/backend/aircraft/adsblol-remote/aircraft-store.mjs";

const location = { latitude: 43.8, longitude: -70.4 };
const record = (hex = "ABC123", flight = "RPA1") => ({
  hex,
  flight,
  lat: 43.9,
  lon: -70.3,
  seen_pos: 0,
});

test("stores remote aircraft and adds missing route data", async () => {
  const lookup = {
    getCallsignRoute: jest.fn(async () => ({ origin: "KBOS", destination: "KORD" })),
  };
  const onRouteUpdate = jest.fn();
  const store = createAdsbLolAircraftStore({ location, lookup, onRouteUpdate });
  store.update(record());
  await Promise.resolve();
  expect(store.list()).toMatchObject([{ icao: "ABC123", callsign: "RPA1", origin: "KBOS" }]);
  expect(lookup.getCallsignRoute).toHaveBeenCalledWith("RPA1");
  expect(onRouteUpdate).toHaveBeenCalledTimes(1);
});

test("preserves route data for the same callsign and skips complete routes", async () => {
  const lookup = {
    getCallsignRoute: jest.fn(async () => ({ origin: "KBOS", destination: "KORD" })),
  };
  const store = createAdsbLolAircraftStore({ location, lookup });
  store.update(record());
  await Promise.resolve();
  store.update(record());
  expect(store.list()[0]).toMatchObject({ origin: "KBOS", destination: "KORD" });
  expect(lookup.getCallsignRoute).toHaveBeenCalledTimes(1);
});

test("does not reuse route data after a callsign changes", async () => {
  const lookup = { getCallsignRoute: jest.fn(async () => ({ origin: "KBOS" })) };
  const store = createAdsbLolAircraftStore({ location, lookup });
  store.update(record());
  await Promise.resolve();
  store.update(record("ABC123", "RPA2"));
  await Promise.resolve();
  expect(store.list()[0]).toMatchObject({ callsign: "RPA2", origin: "KBOS" });
  expect(lookup.getCallsignRoute).toHaveBeenCalledTimes(2);
});

test("ignores stale route results and empty route results", async () => {
  let resolveRoute;
  const lookup = {
    getCallsignRoute: jest
      .fn()
      .mockImplementationOnce(() => new Promise((resolve) => (resolveRoute = resolve)))
      .mockResolvedValueOnce(null),
  };
  const onRouteUpdate = jest.fn();
  const store = createAdsbLolAircraftStore({ location, lookup, onRouteUpdate });
  store.update(record());
  store.update(record("ABC123", "RPA2"));
  resolveRoute({ origin: "KBOS" });
  await Promise.resolve();
  await Promise.resolve();
  expect(onRouteUpdate).not.toHaveBeenCalled();
  expect(store.list()[0]).toMatchObject({ callsign: "RPA2" });
});

test("skips disabled lookups, missing callsigns, and unavailable lookup services", () => {
  const lookup = { getCallsignRoute: jest.fn() };
  const store = createAdsbLolAircraftStore({ location, lookup });
  store.setRouteLookupsEnabled(false);
  store.update(record());
  store.setRouteLookupsEnabled(true);
  store.update({ ...record(), flight: "" });
  expect(lookup.getCallsignRoute).not.toHaveBeenCalled();
  expect(() => createAdsbLolAircraftStore({ location }).update(record())).not.toThrow();
});

test("expires old tracks, rejects invalid records, and clears its records", () => {
  let now = 10_000;
  const store = createAdsbLolAircraftStore({ location, clock: () => now });
  store.update(record());
  store.update({ ...record("BAD"), lat: "43" });
  expect(store.list()).toHaveLength(1);
  now += 120_001;
  expect(store.list()).toEqual([]);
  store.update(record());
  store.clear();
  expect(store.list()).toEqual([]);
});

test("ignores failed route lookups", async () => {
  const lookup = {
    getCallsignRoute: jest.fn(async () => {
      throw new Error("offline");
    }),
  };
  const store = createAdsbLolAircraftStore({ location, lookup });
  store.update(record());
  await Promise.resolve();
  await Promise.resolve();
  expect(store.list()).toHaveLength(1);
});
