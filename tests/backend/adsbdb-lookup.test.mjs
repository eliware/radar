import { expect, jest, test } from "@jest/globals";
import { createAdsbdbLookup } from "../../src/backend/adsbdb-lookup.mjs";

const response = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

test("looks up and caches type codes by normalized ICAO hex", async () => {
  const request = jest.fn(async () =>
    response({ response: { aircraft: { icao_type: " B738 " } } }),
  );
  const lookup = createAdsbdbLookup({ request });
  await expect(lookup.getAircraftType(" abc123 ")).resolves.toEqual({ aircraftTypeCode: "B738" });
  await expect(lookup.getAircraftType("ABC123")).resolves.toEqual({ aircraftTypeCode: "B738" });
  expect(request).toHaveBeenCalledTimes(1);
  expect(request).toHaveBeenCalledWith("https://api.adsbdb.com/v0/aircraft/ABC123");
  await expect(lookup.getAircraftType("")).resolves.toBeNull();
  await expect(lookup.getAircraftType(null)).resolves.toBeNull();
  await expect(createAdsbdbLookup().getAircraftType(null)).resolves.toBeNull();
});

test("looks up callsign origin and destination codes", async () => {
  const request = jest.fn(async () =>
    response({
      response: {
        flightroute: {
          origin: { icao_code: " kpwm " },
          destination: { icao_code: "KBOS" },
        },
      },
    }),
  );
  const lookup = createAdsbdbLookup({ request });
  await expect(lookup.getCallsignRoute(" afr012 ")).resolves.toEqual({
    origin: "KPWM",
    destination: "KBOS",
  });
  expect(request).toHaveBeenCalledWith("https://api.adsbdb.com/v0/callsign/AFR012");
  await expect(lookup.getCallsignRoute("AD")).resolves.toBeNull();
  await expect(lookup.getCallsignRoute(undefined)).resolves.toBeNull();
  const partialLookup = createAdsbdbLookup({
    request: async () =>
      response({
        response: {
          flightroute: { origin: {}, destination: { icao_code: "kjfk" } },
        },
      }),
  });
  await expect(partialLookup.getCallsignRoute("BAW183")).resolves.toEqual({
    destination: "KJFK",
  });
  const originOnly = createAdsbdbLookup({
    request: async () =>
      response({
        response: {
          flightroute: { origin: { icao_code: "egll" }, destination: {} },
        },
      }),
  });
  await expect(originOnly.getCallsignRoute("AFR012")).resolves.toEqual({ origin: "EGLL" });
});

test("caches missing records for their time limit, then retries", async () => {
  let now = 0;
  const request = jest.fn(async () => response({}, 404));
  const lookup = createAdsbdbLookup({ request, clock: () => now, missingTtlMs: 5 });
  await expect(lookup.getAircraftType("ABC123")).resolves.toBeNull();
  await expect(lookup.getAircraftType("ABC123")).resolves.toBeNull();
  expect(request).toHaveBeenCalledTimes(1);
  now = 6;
  await lookup.getAircraftType("ABC123");
  expect(request).toHaveBeenCalledTimes(2);
});

test("deduplicates active requests and caches malformed or failed responses briefly", async () => {
  let rejectRequest = false;
  let finish;
  const request = jest.fn(() =>
    rejectRequest
      ? Promise.reject(new Error("offline"))
      : new Promise((resolve) => {
          finish = resolve;
        }),
  );
  const lookup = createAdsbdbLookup({ request, failureTtlMs: 5, missingTtlMs: 5 });
  const first = lookup.getAircraftType("ABC123");
  const second = lookup.getAircraftType("ABC123");
  await Promise.resolve();
  expect(request).toHaveBeenCalledTimes(1);
  finish(response({ response: { aircraft: {} } }));
  await expect(first).resolves.toBeNull();
  await expect(second).resolves.toBeNull();
  rejectRequest = true;
  await expect(lookup.getCallsignRoute("BAW183")).resolves.toBeNull();
  await expect(lookup.getCallsignRoute("BAW183")).resolves.toBeNull();
  expect(request).toHaveBeenCalledTimes(2);
  await expect(lookup.getCallsignRoute("BAW184")).resolves.toBeNull();
  expect(request).toHaveBeenCalledTimes(3);
});

test("returns no data for HTTP errors and malformed route records", async () => {
  const request = jest
    .fn()
    .mockResolvedValueOnce(response({}, 503))
    .mockResolvedValueOnce(
      response({ response: { flightroute: { origin: {}, destination: {} } } }),
    );
  const lookup = createAdsbdbLookup({ request });
  await expect(lookup.getAircraftType("ABC123")).resolves.toBeNull();
  await expect(lookup.getCallsignRoute("BAW183")).resolves.toBeNull();
});

test("bounds the lookup cache and reloads an evicted aircraft", async () => {
  const request = jest.fn(async () => response({ response: { aircraft: { icao_type: "B738" } } }));
  const lookup = createAdsbdbLookup({ request, maxCacheEntries: 2 });
  await lookup.getAircraftType("ABC123");
  await lookup.getAircraftType("DEF456");
  await lookup.getAircraftType("789ABC");
  await lookup.getAircraftType("ABC123");
  expect(request).toHaveBeenCalledTimes(4);
});
