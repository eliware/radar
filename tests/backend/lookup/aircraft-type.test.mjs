import { expect, jest, test } from "@jest/globals";
import { createAircraftTypeLookup } from "../../../src/backend/lookup/aircraft-type.mjs";

const response = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});
const direct = (_key, load) => load();

test("normalizes the hex, requests matching data, and returns a trimmed type code", async () => {
  const request = jest.fn(async () => response({ ac: [{ hex: "abc123", t: " B738 " }] }));
  const lookup = createAircraftTypeLookup(request, direct);
  await expect(lookup(" abc123 ")).resolves.toEqual({ aircraftTypeCode: "B738" });
  expect(request).toHaveBeenCalledWith(
    "https://api.adsb.lol/v2/hex/ABC123",
    expect.objectContaining({ headers: expect.any(Object) }),
  );
});

test("returns null for invalid, absent, and unusable aircraft records", async () => {
  const request = jest
    .fn()
    .mockResolvedValueOnce(response({ ac: [] }))
    .mockResolvedValueOnce(response({ ac: [{ hex: "DEF456", t: " " }] }))
    .mockResolvedValueOnce(response({}, 404));
  const lookup = createAircraftTypeLookup(request, direct);
  await expect(lookup(null)).resolves.toBeNull();
  await expect(lookup("ABC123")).resolves.toBeNull();
  await expect(lookup("DEF456")).resolves.toBeNull();
  await expect(lookup("789ABC")).resolves.toBeNull();
  expect(request).toHaveBeenCalledTimes(3);
});

test("rejects unsuccessful aircraft requests for the coordinator cache", async () => {
  const lookup = createAircraftTypeLookup(async () => response({}, 503), direct);
  await expect(lookup("ABC123")).rejects.toThrow("ADSB.lol request failed");
});
