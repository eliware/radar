import { expect, test } from "@jest/globals";
import { preserveRouteData } from "../../../../../src/backend/aircraft/adsblol-remote/track/route-data.mjs";

const mapped = (callsign = "RPA1") => ({ icao: "ABC123", callsign });

test("preserves route details only when callsign is unchanged", () => {
  const previous = { callsign: "RPA1", origin: "KBOS" };
  expect(preserveRouteData(mapped(), previous)).toBe(previous);
  expect(preserveRouteData(mapped("RPA2"), previous)).toEqual({});
  expect(preserveRouteData(mapped(), undefined)).toEqual({});
});
