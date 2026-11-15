import { expect, jest, test } from "@jest/globals";
import { createAircraftTrails } from "../../../src/frontend/aircraft/trails.mjs";

test("stores distinct recent points and removes expired aircraft", () => {
  let now = 0;
  const trails = createAircraftTrails(() => now);
  trails.add("ABC", { x: 0, y: 0, z: 0 });
  now += 1;
  trails.add("ABC", { x: 0.001, y: 0, z: 0 });
  expect(trails.get("ABC")).toHaveLength(1);
  for (let x = 1; x <= 125; x += 1) trails.add("ABC", { x, y: 0, z: 0 });
  expect(trails.get("ABC")).toHaveLength(120);
  expect(trails.get("ABC").at(-1).x).toBe(125);
  trails.add("BAD", { x: Number.NaN, y: 0, z: 0 });
  expect(trails.get("BAD")).toEqual([]);
  trails.remove(["ABC"]);
  expect(trails.get("ABC")).toEqual([]);
  trails.clear();
});

test("uses the current time when no clock is supplied", () => {
  jest.useFakeTimers().setSystemTime(1000);
  const trails = createAircraftTrails();
  try {
    trails.add("ABC", { x: 0, y: 0, z: 0 });
    expect(trails.get("ABC")[0].recordedAt).toBe(1000);
  } finally {
    jest.useRealTimers();
  }
});

test("keeps aircraft history for two minutes and expires points at the age limit", () => {
  let now = 0;
  const trails = createAircraftTrails(() => now);
  trails.add("ABC", { x: 0, y: 0, z: 0 });
  now = 60_000;
  trails.add("ABC", { x: 1, y: 0, z: 0 });
  now = 119_999;
  expect(trails.get("ABC").map(({ x }) => x)).toEqual([0, 1]);
  now = 120_000;
  expect(trails.get("ABC").map(({ x }) => x)).toEqual([1]);
  now = 180_000;
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
