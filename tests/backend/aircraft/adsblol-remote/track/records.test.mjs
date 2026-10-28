import { expect, test } from "@jest/globals";
import { createAdsbLolTrackRecords } from "../../../../../src/backend/aircraft/adsblol-remote/track/records.mjs";

test("stores and retrieves records in insertion order", () => {
  const records = createAdsbLolTrackRecords({ clock: () => 1_000 });
  const first = { lastSeen: 1_000 };
  const second = { lastSeen: 1_000 };
  records.set("ABC123", first);
  records.set("DEF456", second);
  expect(records.get("ABC123")).toBe(first);
  expect(records.list()).toEqual([first, second]);
});

test("uses the default clock when no options are provided", () => {
  expect(createAdsbLolTrackRecords().list()).toEqual([]);
});

test("expires stale records and clears the record map", () => {
  let now = 10_000;
  const records = createAdsbLolTrackRecords({ clock: () => now });
  records.set("ABC123", { lastSeen: now });
  now += 120_001;
  expect(records.list()).toEqual([]);
  records.set("DEF456", { lastSeen: now });
  records.clear();
  expect(records.list()).toEqual([]);
});
