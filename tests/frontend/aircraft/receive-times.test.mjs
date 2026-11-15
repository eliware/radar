import { expect, test } from "@jest/globals";
import { createAircraftReceiveTimes } from "../../../src/frontend/aircraft/receive-times.mjs";

test("tracks observed timestamps and falls back to item timestamps", () => {
  const received = createAircraftReceiveTimes(() => 1000);
  received.set("ABC", 750);
  received.set("DEF", Number.NaN);
  const items = received.withReceivedAt(
    new Map([
      ["ABC", { icao: "ABC" }],
      ["REMOTE", { icao: "REMOTE", lastSeen: 500 }],
      ["DEF", { icao: "DEF" }],
    ]),
  );
  expect(items.get("ABC").receivedAt).toBe(750);
  expect(items.get("REMOTE").receivedAt).toBe(500);
  expect(items.get("DEF").receivedAt).toBe(1000);
});

test("removes timestamps with aircraft and clears all timestamps", () => {
  const received = createAircraftReceiveTimes(() => 1000);
  received.set("ABC", 750);
  received.remove(["ABC"]);
  expect(received.withReceivedAt(new Map([["ABC", { icao: "ABC" }]])).get("ABC").receivedAt).toBe(
    undefined,
  );
  received.set("DEF", 900);
  received.clear();
  expect(received.withReceivedAt(new Map([["DEF", { icao: "DEF" }]])).get("DEF").receivedAt).toBe(
    undefined,
  );
});

test("ignores entries without an aircraft identifier", () => {
  const received = createAircraftReceiveTimes(() => 1000);
  received.set("", 750);
  expect(received.withReceivedAt(new Map([["", { icao: "" }]])).get("").receivedAt).toBe(undefined);
});
