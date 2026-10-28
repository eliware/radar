import { expect, test } from "@jest/globals";
import { createAdsbLolTrackStore } from "../../../../../src/backend/aircraft/adsblol-remote/track/store.mjs";

test("does not store invalid remote records", () => {
  const store = createAdsbLolTrackStore({ location: { latitude: 43, longitude: -70 } });
  expect(store.update({ hex: "", lat: 43, lon: -70 })).toBeNull();
  expect(store.list()).toEqual([]);
});
