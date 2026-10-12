import { expect, test } from "@jest/globals";
import { distanceNauticalMiles } from "../../src/shared/distance-nautical-miles.mjs";

test("returns zero for the same point", () => {
  expect(
    distanceNauticalMiles({ latitude: 43, longitude: -70 }, { latitude: 43, longitude: -70 }),
  ).toBe(0);
});

test("calculates distance in nautical miles", () => {
  const home = { latitude: 43, longitude: -70 };
  expect(distanceNauticalMiles(home, { latitude: 44, longitude: -70 })).toBeCloseTo(60.04, 1);
});
