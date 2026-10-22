import { expect, jest, test } from "@jest/globals";
import { createAdsbLolLookup } from "../../src/backend/adsblol-lookup.mjs";

const response = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});
const requestOptions = {
  headers: {
    "user-agent": "EliwareRadar/15.0.0 (+https://radar.purinton.us; contact: radar@eliware.org)",
  },
};

test("looks up aircraft type by normalized hex and caches the result", async () => {
  const request = jest.fn(async () => response({ ac: [{ hex: "abc123", t: " B738 " }] }));
  const lookup = createAdsbLolLookup({ request });
  await expect(lookup.getAircraftType(" abc123 ")).resolves.toEqual({ aircraftTypeCode: "B738" });
  await expect(lookup.getAircraftType("ABC123")).resolves.toEqual({ aircraftTypeCode: "B738" });
  expect(request).toHaveBeenCalledTimes(1);
  expect(request).toHaveBeenCalledWith("https://api.adsb.lol/v2/hex/ABC123", requestOptions);
});

test("returns null for missing, malformed, and failed aircraft lookups", async () => {
  const request = jest
    .fn()
    .mockResolvedValueOnce(response({ ac: [] }))
    .mockResolvedValueOnce(response({ ac: [{ hex: "DEF456", t: " " }] }))
    .mockResolvedValueOnce(response({}))
    .mockResolvedValueOnce(response({}, 404))
    .mockResolvedValueOnce(response({}, 503));
  const lookup = createAdsbLolLookup({ request });
  await expect(lookup.getAircraftType("ABC123")).resolves.toBeNull();
  await expect(lookup.getAircraftType("DEF456")).resolves.toBeNull();
  await expect(lookup.getAircraftType("789ABC")).resolves.toBeNull();
  await expect(lookup.getAircraftType("123ABC")).resolves.toBeNull();
  await expect(lookup.getAircraftType("456ABC")).resolves.toBeNull();
  await expect(lookup.getAircraftType(null)).resolves.toBeNull();
  await expect(lookup.getAircraftType(" ")).resolves.toBeNull();
  await expect(createAdsbLolLookup().getAircraftType(null)).resolves.toBeNull();
});

test("gets route JSON by normalized callsign and caches the result", async () => {
  const request = jest.fn(async () =>
    response({
      callsign: "BAW183",
      airport_codes: "EGLL-KJFK",
      _airports: [{ icao: "egll" }, { icao: "kjfk" }],
    }),
  );
  const lookup = createAdsbLolLookup({ request });
  await expect(lookup.getCallsignRoute(" baw183 ")).resolves.toEqual({
    origin: "EGLL",
    destination: "KJFK",
  });
  await expect(lookup.getCallsignRoute("BAW183")).resolves.toEqual({
    origin: "EGLL",
    destination: "KJFK",
  });
  expect(request).toHaveBeenCalledTimes(1);
  expect(request).toHaveBeenCalledWith(
    "https://vrs-standing-data.adsb.lol/routes/BA/BAW183.json",
    requestOptions,
  );
});

test("supports partial route records and ignores unusable airport codes", async () => {
  const request = jest
    .fn()
    .mockResolvedValueOnce(response({ airport_codes: "KPWM-KBOS" }))
    .mockResolvedValueOnce(response({ _airports: [{ icao: "invalid" }, { icao: "KBOS" }] }))
    .mockResolvedValueOnce(response({ _airports: [{ icao: "KPWM" }] }))
    .mockResolvedValueOnce(response({ airport_codes: "unknown" }));
  const lookup = createAdsbLolLookup({ request });
  await expect(lookup.getCallsignRoute("AFR012")).resolves.toEqual({
    origin: "KPWM",
    destination: "KBOS",
  });
  await expect(lookup.getCallsignRoute("AFR013")).resolves.toEqual({ destination: "KBOS" });
  await expect(lookup.getCallsignRoute("AFR014")).resolves.toEqual({ origin: "KPWM" });
  await expect(lookup.getCallsignRoute("AFR015")).resolves.toBeNull();
});

test("returns null for missing routes, failed requests, and unusable callsigns", async () => {
  const request = jest
    .fn()
    .mockResolvedValueOnce(response({}, 404))
    .mockResolvedValueOnce(response({}, 503));
  const lookup = createAdsbLolLookup({ request });
  await expect(lookup.getCallsignRoute("BAW183")).resolves.toBeNull();
  await expect(lookup.getCallsignRoute("BAW184")).resolves.toBeNull();
  await expect(lookup.getCallsignRoute("AD")).resolves.toBeNull();
  await expect(lookup.getCallsignRoute(undefined)).resolves.toBeNull();
  expect(request).toHaveBeenCalledTimes(2);
});
