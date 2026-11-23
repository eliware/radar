import { expect, jest, test } from "@jest/globals";
import { default as applyAdsbLolRouteResult } from "../../../../../src/backend/aircraft/adsblol-remote/route/apply.mjs";

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

test("notifies consumers after applying route data", () => {
  const aircraft = new Map([["ABC123", { icao: "ABC123" }]]);
  const onRouteUpdate = jest.fn();
  applyAdsbLolRouteResult(aircraft, "ABC123", { origin: "KBOS" }, onRouteUpdate);
  expect(aircraft.get("ABC123")).toEqual({ icao: "ABC123", origin: "KBOS" });
  expect(onRouteUpdate).toHaveBeenCalledTimes(1);
});
