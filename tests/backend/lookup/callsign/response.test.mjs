import { expect, test } from "@jest/globals";
import { parseCallsignRouteResponse } from "../../../../src/backend/lookup/callsign/response.mjs";

test("handles missing, failed, and unusable route responses", async () => {
  expect(await parseCallsignRouteResponse({ status: 404, ok: false })).toBeNull();
  await expect(parseCallsignRouteResponse({ status: 503, ok: false })).rejects.toThrow(
    "ADSB.lol request failed",
  );
  const json = async () => ({});
  await expect(parseCallsignRouteResponse({ status: 200, ok: true, json })).resolves.toBeNull();
});

test("delegates successful response data to the shared route parser", async () => {
  const json = async () => ({ airport_codes: "KPWM-KBOS" });
  await expect(parseCallsignRouteResponse({ status: 200, ok: true, json })).resolves.toEqual({
    origin: "KPWM",
    destination: "KBOS",
  });
});
