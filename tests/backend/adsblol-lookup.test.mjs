import { expect, jest, test } from "@jest/globals";
import { createAdsbLolLookup } from "../../src/backend/adsblol-lookup.mjs";

const response = (body) => ({ ok: true, status: 200, json: async () => body });
const requestOptions = {
  headers: {
    "user-agent": "EliwareRadar/15.0.1 (+https://radar.purinton.us; contact: radar@eliware.org)",
  },
};

test("assembles aircraft and callsign lookups over a shared cache", async () => {
  const request = jest
    .fn()
    .mockResolvedValueOnce(response({ ac: [{ hex: "ABC123", t: "B738" }] }))
    .mockResolvedValueOnce(response({ airport_codes: "EGLL-KJFK" }));
  const lookup = createAdsbLolLookup({ request });
  await expect(lookup.getAircraftType("abc123")).resolves.toEqual({ aircraftTypeCode: "B738" });
  await expect(lookup.getCallsignRoute("BAW183")).resolves.toEqual({
    origin: "EGLL",
    destination: "KJFK",
  });
  await lookup.getAircraftType(" ABC123 ");
  await lookup.getCallsignRoute(" baw183 ");
  expect(request).toHaveBeenCalledTimes(2);
  expect(request).toHaveBeenNthCalledWith(1, "https://api.adsb.lol/v2/hex/ABC123", requestOptions);
  expect(request).toHaveBeenNthCalledWith(
    2,
    "https://vrs-standing-data.adsb.lol/routes/BA/BAW183.json",
    requestOptions,
  );
});

test("supports default options without making a request for unusable values", async () => {
  await expect(createAdsbLolLookup().getAircraftType(null)).resolves.toBeNull();
  await expect(createAdsbLolLookup({}).getCallsignRoute("AD")).resolves.toBeNull();
});
