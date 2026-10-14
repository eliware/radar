import { expect, jest, test } from "@jest/globals";
import { createAdsbdbLookup } from "../../src/backend/adsbdb-lookup.mjs";

const response = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

test("normalizes ICAO hex and maps the aircraft type code", async () => {
  const request = jest.fn(async () =>
    response({ response: { aircraft: { icao_type: " B738 " } } }),
  );
  const lookup = createAdsbdbLookup({ request });
  await expect(lookup.getAircraftType(" abc123 ")).resolves.toEqual({ aircraftTypeCode: "B738" });
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

test("returns no data for HTTP errors and malformed route records", async () => {
  const request = jest
    .fn()
    .mockResolvedValueOnce(response({}, 503))
    .mockResolvedValueOnce(response({ response: { flightroute: { origin: {}, destination: {} } } }))
    .mockResolvedValueOnce(response({ response: { aircraft: { icao_type: " " } } }))
    .mockResolvedValueOnce(response({}, 404));
  const lookup = createAdsbdbLookup({ request });
  await expect(lookup.getAircraftType("ABC123")).resolves.toBeNull();
  await expect(lookup.getCallsignRoute("BAW183")).resolves.toBeNull();
  await expect(lookup.getAircraftType("DEF456")).resolves.toBeNull();
  await expect(lookup.getAircraftType("789ABC")).resolves.toBeNull();
});
