import { expect, jest, test } from "@jest/globals";
import { createAdsbLolRouteEnrichment } from "../../../../../src/backend/aircraft/adsblol-remote/route/enrichment.mjs";

const mapped = (callsign = "RPA1") => ({ icao: "ABC123", callsign });

test("looks up and publishes missing route data", async () => {
  const lookup = {
    getCallsignRoute: jest.fn(async () => ({ origin: "KBOS", destination: "KORD" })),
  };
  const onRouteUpdate = jest.fn();
  const aircraft = new Map([["ABC123", mapped()]]);
  const enrichment = createAdsbLolRouteEnrichment({ lookup, onRouteUpdate });
  enrichment.enrich(mapped(), aircraft);
  await Promise.resolve();
  expect(aircraft.get("ABC123")).toMatchObject({ origin: "KBOS", destination: "KORD" });
  expect(onRouteUpdate).toHaveBeenCalledTimes(1);
});

test("uses the default callback after a successful route lookup", async () => {
  const aircraft = new Map([["ABC123", mapped()]]);
  const enrichment = createAdsbLolRouteEnrichment({
    lookup: { getCallsignRoute: async () => ({ origin: "KBOS" }) },
  });
  enrichment.enrich(mapped(), aircraft);
  await Promise.resolve();
  expect(aircraft.get("ABC123")).toMatchObject({ origin: "KBOS" });
});

test("skips disabled lookups, missing callsigns, complete routes, and absent services", () => {
  const lookup = { getCallsignRoute: jest.fn() };
  const enrichment = createAdsbLolRouteEnrichment({ lookup });
  const aircraft = new Map([["ABC123", { ...mapped(), origin: "KBOS", destination: "KORD" }]]);
  enrichment.enrich(mapped(), aircraft);
  enrichment.enrich(mapped(""), aircraft);
  enrichment.setEnabled(false);
  enrichment.setEnabled(false);
  enrichment.enrich(mapped(), aircraft);
  enrichment.setEnabled(true);
  createAdsbLolRouteEnrichment({}).enrich(mapped(), aircraft);
  expect(lookup.getCallsignRoute).not.toHaveBeenCalled();
});

test("ignores stale, empty, and failed route lookup results", async () => {
  let resolveStale;
  const lookup = {
    getCallsignRoute: jest
      .fn()
      .mockImplementationOnce(() => new Promise((resolve) => (resolveStale = resolve)))
      .mockResolvedValueOnce(null)
      .mockRejectedValueOnce(new Error("offline")),
  };
  const onRouteUpdate = jest.fn();
  const aircraft = new Map([["ABC123", mapped()]]);
  const enrichment = createAdsbLolRouteEnrichment({ lookup, onRouteUpdate });
  enrichment.enrich(mapped(), aircraft);
  aircraft.set("ABC123", mapped("RPA2"));
  resolveStale({ origin: "KBOS" });
  await Promise.resolve();
  enrichment.enrich(mapped("RPA2"), aircraft);
  enrichment.enrich(mapped("RPA2"), aircraft);
  await Promise.resolve();
  await Promise.resolve();
  expect(onRouteUpdate).not.toHaveBeenCalled();
  expect(aircraft.get("ABC123")).toEqual(mapped("RPA2"));
});

test("ignores pending results after lookups are disabled and re-enabled", async () => {
  let resolveRoute;
  const onRouteUpdate = jest.fn();
  const aircraft = new Map([["ABC123", mapped()]]);
  const enrichment = createAdsbLolRouteEnrichment({
    lookup: { getCallsignRoute: () => new Promise((resolve) => (resolveRoute = resolve)) },
    onRouteUpdate,
  });
  enrichment.enrich(mapped(), aircraft);
  enrichment.setEnabled(false);
  enrichment.setEnabled(true);
  resolveRoute({ origin: "KBOS" });
  await Promise.resolve();
  expect(aircraft.get("ABC123")).toEqual(mapped());
  expect(onRouteUpdate).not.toHaveBeenCalled();
});
