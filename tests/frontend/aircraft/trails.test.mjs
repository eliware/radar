import { expect, test } from "@jest/globals";
import { createAircraftTrails } from "../../../src/frontend/aircraft/trails.mjs";

test("stores distinct recent points and removes expired aircraft", () => {
  const trails = createAircraftTrails();
  trails.add("ABC", { x: 0, y: 0, z: 0 });
  trails.add("ABC", { x: 0.001, y: 0, z: 0 });
  expect(trails.get("ABC")).toHaveLength(1);
  for (let x = 1; x <= 25; x += 1) trails.add("ABC", { x, y: 0, z: 0 });
  expect(trails.get("ABC")).toHaveLength(20);
  expect(trails.get("ABC").at(-1).x).toBe(25);
  trails.add("BAD", { x: Number.NaN, y: 0, z: 0 });
  expect(trails.get("BAD")).toEqual([]);
  trails.remove(["ABC"]);
  expect(trails.get("ABC")).toEqual([]);
  trails.clear();
});

test("keeps only aircraft history from the past 60 seconds", () => {
  let now = 0;
  const trails = createAircraftTrails(() => now);
  trails.add("ABC", { x: 0, y: 0, z: 0 });
  now = 30_000;
  trails.add("ABC", { x: 1, y: 0, z: 0 });
  now = 60_001;
  expect(trails.get("ABC").map(({ x }) => x)).toEqual([1]);
  now = 90_001;
  expect(trails.get("ABC")).toEqual([]);
});

test("composes observation timestamps and clears them with aircraft history", () => {
  const trails = createAircraftTrails(() => 1000);
  trails.add("ABC", { x: 0, y: 0, z: 0 }, 750);
  expect(trails.withReceivedAt(new Map([["ABC", { icao: "ABC" }]])).get("ABC").receivedAt).toBe(
    750,
  );
  expect(
    trails.withReceivedAt(new Map([["REMOTE", { icao: "REMOTE", lastSeen: 500 }]])).get("REMOTE")
      .receivedAt,
  ).toBe(500);
  trails.remove(["ABC"]);
  expect(trails.withReceivedAt(new Map([["ABC", { icao: "ABC" }]])).get("ABC").receivedAt).toBe(
    undefined,
  );
  trails.add("DEF", { x: 1, y: 0, z: 0 }, Number.NaN);
  expect(trails.withReceivedAt(new Map([["DEF", { icao: "DEF" }]])).get("DEF").receivedAt).toBe(
    1000,
  );
  trails.clear();
  expect(trails.withReceivedAt(new Map([["DEF", { icao: "DEF" }]])).get("DEF").receivedAt).toBe(
    undefined,
  );
});
