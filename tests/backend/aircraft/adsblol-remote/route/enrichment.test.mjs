import { expect, jest, test } from "@jest/globals";
import { createAdsbLolRouteEnrichment } from "../../../../../src/backend/aircraft/adsblol-remote/route/enrichment.mjs";

const mapped = (callsign = "RPA1") => ({ icao: "ABC123", callsign });

test("looks up missing route data and publishes an update", async () => {
  const lookup = {
    getCallsignRoute: jest.fn(async () => ({ origin: "KBOS", destination: "KORD" })),
  };
  const onRouteUpdate = jest.fn();
  const aircraft = new Map([["ABC123", mapped()]]);
  const enrichment = createAdsbLolRouteEnrichment({ lookup, onRouteUpdate });
  enrichment.enrich(mapped(), aircraft);
  await Promise.resolve();
  expect(lookup.getCallsignRoute).toHaveBeenCalledWith("RPA1");
  expect(onRouteUpdate).toHaveBeenCalledTimes(1);
});

test("uses the default update callback after a successful lookup", async () => {
  const getCallsignRoute = jest.fn(async () => ({ origin: "KBOS" }));
  const aircraft = new Map([["ABC123", mapped()]]);
  const enrichment = createAdsbLolRouteEnrichment({
    lookup: { getCallsignRoute },
  });
  enrichment.enrich(mapped(), aircraft);
  await Promise.resolve();
  expect(getCallsignRoute).toHaveBeenCalledWith("RPA1");
});

test("skips disabled lookups, missing callsigns, complete routes, and absent services", () => {
  const lookup = { getCallsignRoute: jest.fn() };
  const enrichment = createAdsbLolRouteEnrichment({ lookup });
  const aircraft = new Map([["ABC123", { ...mapped(), origin: "KBOS", destination: "KORD" }]]);
  enrichment.enrich(mapped(), aircraft);
  enrichment.enrich(mapped(""), aircraft);
  createAdsbLolRouteEnrichment({}).enrich(mapped(), aircraft);
  expect(lookup.getCallsignRoute).not.toHaveBeenCalled();
});

test("leaves aircraft unchanged when route lookup returns no result or fails", async () => {
  const onRouteUpdate = jest.fn();
  const aircraft = new Map([["ABC123", mapped()]]);
  const noResult = createAdsbLolRouteEnrichment({
    lookup: { getCallsignRoute: async () => null },
    onRouteUpdate,
  });
  noResult.enrich(mapped(), aircraft);
  const failure = createAdsbLolRouteEnrichment({
    lookup: { getCallsignRoute: async () => Promise.reject(new Error("offline")) },
    onRouteUpdate,
  });
  failure.enrich(mapped(), aircraft);
  await Promise.resolve();
  await Promise.resolve();
  expect(aircraft.get("ABC123")).toEqual(mapped());
  expect(onRouteUpdate).not.toHaveBeenCalled();
});
