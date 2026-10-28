import { expect, test } from "@jest/globals";
import { applyAdsbLolRouteResult } from "../../../../../src/backend/aircraft/adsblol-remote/route/apply.mjs";

test("applies route fields while retaining existing aircraft data", () => {
  const aircraft = new Map([["ABC123", { icao: "ABC123", callsign: "RPA1" }]]);
  applyAdsbLolRouteResult(aircraft, "ABC123", { origin: "KBOS", destination: "KORD" });
  expect(aircraft.get("ABC123")).toEqual({
    icao: "ABC123",
    callsign: "RPA1",
    origin: "KBOS",
    destination: "KORD",
  });
});
