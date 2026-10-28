import { expect, jest, test } from "@jest/globals";
import { createCallsignRouteService } from "../../../../src/backend/lookup/callsign/route-service.mjs";

const response = (origin) => ({
  ok: true,
  status: 200,
  json: async () => ({ airport_codes: `${origin}-KBOS` }),
});

test("caches callsign routes for the configured route TTL", async () => {
  let now = 0;
  const request = jest
    .fn()
    .mockResolvedValueOnce(response("KPWM"))
    .mockResolvedValueOnce(response("KJFK"));
  const getCallsignRoute = createCallsignRouteService({
    request,
    clock: () => now,
    routeTtlMs: 50,
  });

  await expect(getCallsignRoute("BAW183")).resolves.toEqual({
    origin: "KPWM",
    destination: "KBOS",
  });
  await expect(getCallsignRoute("BAW183")).resolves.toEqual({
    origin: "KPWM",
    destination: "KBOS",
  });
  expect(request).toHaveBeenCalledTimes(1);
  now = 51;
  await expect(getCallsignRoute("BAW183")).resolves.toEqual({
    origin: "KJFK",
    destination: "KBOS",
  });
  expect(request).toHaveBeenCalledTimes(2);
});

test("uses the configured entry limit for its private cache", async () => {
  const request = jest
    .fn()
    .mockResolvedValueOnce(response("KPWM"))
    .mockResolvedValueOnce(response("KJFK"))
    .mockResolvedValueOnce(response("KEWR"));
  const getCallsignRoute = createCallsignRouteService({ request, maxCacheEntries: 1 });

  await getCallsignRoute("BAW183");
  await getCallsignRoute("BAW184");
  await getCallsignRoute("BAW183");
  expect(request).toHaveBeenCalledTimes(3);
});
