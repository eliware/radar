import { expect, test } from "@jest/globals";
import { distanceNauticalMiles } from "../../src/shared/distance-nautical-miles.mjs";
import { runwayDestination } from "../../src/frontend/runway-destination.mjs";

test.each([
  [0, 1, 0],
  [90, 0, 1],
  [180, -1, 0],
  [270, 0, -1],
])("moves 60 nautical miles at bearing %s", (bearing, latitude, longitude) => {
  const result = runwayDestination({ latitude: 0, longitude: 0 }, bearing, 60);
  expect(result.latitude).toBeCloseTo(latitude, 2);
  expect(result.longitude).toBeCloseTo(longitude, 2);
});

test("keeps distance accurate at high latitude", () => {
  const origin = { latitude: 70, longitude: -40 };
  const result = runwayDestination(origin, 135, 10);
  expect(distanceNauticalMiles(origin, result)).toBeCloseTo(10, 3);
});
