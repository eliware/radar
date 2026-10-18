import { expect, jest, test } from "@jest/globals";
import { storeRemoteAircraft } from "../../../src/backend/aircraft/store-remote-aircraft.mjs";

test("stores remote tracks and enriches missing route data", async () => {
  const aircraft = new Map();
  const lookup = {
    getCallsignRoute: jest.fn(async () => ({ origin: "KBOS", destination: "KORD" })),
  };
  const publish = jest.fn();
  storeRemoteAircraft(
    aircraft,
    { icao: "ABC123", callsign: "RPA1", remoteOnly: true },
    lookup,
    true,
    publish,
  );
  await Promise.resolve();
  expect(aircraft.get("ABC123")).toMatchObject({ origin: "KBOS", destination: "KORD" });
  expect(publish).toHaveBeenCalledTimes(1);
});

test("keeps route data for the same callsign and skips unnecessary lookups", () => {
  const aircraft = new Map([
    ["ABC123", { icao: "ABC123", callsign: "RPA1", origin: "KBOS", destination: "KORD" }],
  ]);
  const lookup = { getCallsignRoute: jest.fn() };
  storeRemoteAircraft(
    aircraft,
    { icao: "ABC123", callsign: "RPA1", aircraftTypeCode: "E75L" },
    lookup,
    true,
    jest.fn(),
  );
  expect(aircraft.get("ABC123")).toMatchObject({ origin: "KBOS", destination: "KORD" });
  expect(lookup.getCallsignRoute).not.toHaveBeenCalled();
});

test("ignores stale lookup responses and unavailable route results", async () => {
  const aircraft = new Map();
  let resolveRoute;
  const lookup = {
    getCallsignRoute: jest.fn(() => new Promise((resolve) => (resolveRoute = resolve))),
  };
  const publish = jest.fn();
  storeRemoteAircraft(aircraft, { icao: "ABC123", callsign: "RPA1" }, lookup, true, publish);
  aircraft.set("ABC123", { icao: "ABC123", callsign: "RPA2" });
  resolveRoute({ origin: "KBOS" });
  await Promise.resolve();
  expect(publish).not.toHaveBeenCalled();
  storeRemoteAircraft(
    aircraft,
    { icao: "DEF456", callsign: "RPA3" },
    {
      getCallsignRoute: async () => null,
    },
    true,
    publish,
  );
  await Promise.resolve();
  expect(publish).not.toHaveBeenCalled();
});

test("handles route lookup rejection", async () => {
  storeRemoteAircraft(
    new Map(),
    { icao: "ABC123", callsign: "RPA1" },
    {
      getCallsignRoute: async () => {
        throw new Error("offline");
      },
    },
    true,
    jest.fn(),
  );
  await Promise.resolve();
  await Promise.resolve();
});
