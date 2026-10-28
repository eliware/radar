import { expect, jest, test } from "@jest/globals";
import { createAircraftTypeService } from "../../../../src/backend/lookup/aircraft/type-service.mjs";

const response = (code) => ({
  ok: true,
  status: 200,
  json: async () => ({ ac: [{ hex: "ABC123", t: code }] }),
});

test("caches aircraft types for the configured success TTL", async () => {
  let now = 0;
  const request = jest
    .fn()
    .mockResolvedValueOnce(response("B738"))
    .mockResolvedValueOnce(response("B739"));
  const getAircraftType = createAircraftTypeService({
    request,
    clock: () => now,
    successTtlMs: 100,
  });

  await expect(getAircraftType("ABC123")).resolves.toEqual({ aircraftTypeCode: "B738" });
  await expect(getAircraftType("ABC123")).resolves.toEqual({ aircraftTypeCode: "B738" });
  expect(request).toHaveBeenCalledTimes(1);
  now = 101;
  await expect(getAircraftType("ABC123")).resolves.toEqual({ aircraftTypeCode: "B739" });
  expect(request).toHaveBeenCalledTimes(2);
});

test("uses the configured entry limit for its private cache", async () => {
  const request = jest
    .fn()
    .mockResolvedValueOnce(response("B738"))
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ ac: [{ hex: "DEF456", t: "A320" }] }),
    })
    .mockResolvedValueOnce(response("B738"));
  const getAircraftType = createAircraftTypeService({ request, maxCacheEntries: 1 });

  await getAircraftType("ABC123");
  await getAircraftType("DEF456");
  await getAircraftType("ABC123");
  expect(request).toHaveBeenCalledTimes(3);
});
