import { expect, test } from "@jest/globals";
import { createAdsbLolTrackStore } from "../../../../../src/backend/aircraft/adsblol-remote/track/store.mjs";

test("expires remote tracks using the injected clock", () => {
  let now = 1_000;
  const store = createAdsbLolTrackStore({
    location: { latitude: 43, longitude: -70 },
    clock: () => now,
  });
  expect(store.update({ hex: "ABC123", lat: 43, lon: -70, seen_pos: 0 })).not.toBeNull();
  expect(store.list()).toHaveLength(1);
  now += 120_001;
  expect(store.list()).toEqual([]);
});
