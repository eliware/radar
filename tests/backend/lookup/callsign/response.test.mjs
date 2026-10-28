import { expect, test } from "@jest/globals";
import {
  parseCallsignRouteResponse,
  parseRoute,
} from "../../../../src/backend/lookup/callsign/response.mjs";

test("parses complete routes and prefers airport records", () => {
  expect(
    parseRoute({ airport_codes: "XXXX-YYYY", _airports: [{ icao: "egll" }, { icao: "kjfk" }] }),
  ).toEqual({ origin: "EGLL", destination: "KJFK" });
});

test("supports partial routes and ignores unusable airport codes", () => {
  expect(parseRoute({ airport_codes: "KPWM-KBOS" })).toEqual({
    origin: "KPWM",
    destination: "KBOS",
  });
  expect(parseRoute({ _airports: [{ icao: "invalid" }, { icao: "KBOS" }] })).toEqual({
    destination: "KBOS",
  });
  expect(parseRoute({ _airports: [{ icao: "KPWM" }] })).toEqual({ origin: "KPWM" });
  expect(parseRoute({ airport_codes: "unknown" })).toBeNull();
  expect(parseRoute(null)).toBeNull();
});

test("handles missing, failed, and successful route responses", async () => {
  expect(await parseCallsignRouteResponse({ status: 404, ok: false })).toBeNull();
  await expect(parseCallsignRouteResponse({ status: 503, ok: false })).rejects.toThrow(
    "ADSB.lol request failed",
  );
  const json = async () => ({ airport_codes: "KPWM-KBOS" });
  await expect(parseCallsignRouteResponse({ status: 200, ok: true, json })).resolves.toEqual({
    origin: "KPWM",
    destination: "KBOS",
  });
});
