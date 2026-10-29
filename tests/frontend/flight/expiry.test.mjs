import { expect, test } from "@jest/globals";
import { pruneExpiredFlightAircraft } from "../../../src/frontend/flight/expiry.mjs";

test("removes aircraft older than two minutes and retains recent or undated entries", () => {
  const aircraft = new Map([
    ["stale", { lastSeen: 1000 }],
    ["recent", { lastSeen: 50000 }],
    ["unknown", {}],
  ]);
  pruneExpiredFlightAircraft(aircraft, 121001);
  expect([...aircraft.keys()]).toEqual(["recent", "unknown"]);
});
