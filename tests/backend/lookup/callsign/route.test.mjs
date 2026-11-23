import { expect, jest, test } from "@jest/globals";
import { default as createCallsignRouteLookup } from "../../../../src/backend/lookup/callsign/route.mjs";

const response = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});
const direct = (_key, load) => load();

function createLookup(request) {
  return createCallsignRouteLookup(request, direct, 60000);
}

test("normalizes callsigns and builds the route URL", async () => {
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

test("skips unusable callsigns before making a request", async () => {
  const request = jest.fn();
  const lookup = createLookup(request);
  await expect(lookup("AD")).resolves.toBeNull();
  await expect(lookup(undefined)).resolves.toBeNull();
  expect(request).not.toHaveBeenCalled();
});

test("rejects failed requests for the coordinator cache", async () => {
  const lookup = createLookup(async () => response({}, 503));
  await expect(lookup("BAW183")).rejects.toThrow("ADSB.lol request failed");
});
