import { expect, test } from "@jest/globals";
import {
  buildCallsignRouteUrl,
  parseRoute,
} from "../../../../../src/backend/lookup/callsign/route/data.mjs";

test("builds encoded ADSB.lol route URLs", () => {
  expect(buildCallsignRouteUrl("BAW183")).toBe(
    "https://vrs-standing-data.adsb.lol/routes/BA/BAW183.json",
  );
  expect(buildCallsignRouteUrl("A B")).toBe(
    "https://vrs-standing-data.adsb.lol/routes/A%20/A%20B.json",
  );
});

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
