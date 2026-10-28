import { expect, jest, test } from "@jest/globals";
import { createCallsignRouteLookup } from "../../../../src/backend/lookup/callsign/route.mjs";

const response = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});
const direct = (_key, load) => load();

function createLookup(request) {
  return createCallsignRouteLookup(request, direct, 60000);
}

test("normalizes callsigns, builds the route URL, and parses airport codes", async () => {
  const request = jest.fn(async () =>
    response({ airport_codes: "EGLL-KJFK", _airports: [{ icao: "egll" }, { icao: "kjfk" }] }),
  );
  await expect(createLookup(request)(" baw183 ")).resolves.toEqual({
    origin: "EGLL",
    destination: "KJFK",
  });
  expect(request).toHaveBeenCalledWith(
    "https://vrs-standing-data.adsb.lol/routes/BA/BAW183.json",
    expect.objectContaining({ headers: expect.any(Object) }),
  );
});

test("supports partial routes and ignores unusable airport codes", async () => {
  const request = jest
    .fn()
    .mockResolvedValueOnce(response({ airport_codes: "KPWM-KBOS" }))
    .mockResolvedValueOnce(response({ _airports: [{ icao: "invalid" }, { icao: "KBOS" }] }))
    .mockResolvedValueOnce(response({ _airports: [{ icao: "KPWM" }] }))
    .mockResolvedValueOnce(response({ airport_codes: "unknown" }));
  const lookup = createLookup(request);
  await expect(lookup("AFR012")).resolves.toEqual({ origin: "KPWM", destination: "KBOS" });
  await expect(lookup("AFR013")).resolves.toEqual({ destination: "KBOS" });
  await expect(lookup("AFR014")).resolves.toEqual({ origin: "KPWM" });
  await expect(lookup("AFR015")).resolves.toBeNull();
});

test("returns null for unusable callsigns and missing routes", async () => {
  const request = jest
    .fn()
    .mockResolvedValueOnce(response({}, 404))
    .mockResolvedValueOnce(response(null));
  const lookup = createLookup(request);
  await expect(lookup("AD")).resolves.toBeNull();
  await expect(lookup(undefined)).resolves.toBeNull();
  await expect(lookup("BAW183")).resolves.toBeNull();
  await expect(lookup("BAW185")).resolves.toBeNull();
  expect(request).toHaveBeenCalledTimes(2);
});

test("rejects failed requests for the coordinator cache", async () => {
  const lookup = createLookup(async () => response({}, 503));
  await expect(lookup("BAW183")).rejects.toThrow("ADSB.lol request failed");
});
