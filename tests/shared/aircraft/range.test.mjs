import { expect, test } from "@jest/globals";
import { calculateAircraftRange } from "../../../src/shared/aircraft/range.mjs";

const origin = { latitude: 43.857616503999, longitude: -70.41360202151915 };

test("calculates distance and bearing from the configured location", () => {
  expect(
    calculateAircraftRange(origin, {
      latitude: origin.latitude,
      longitude: origin.longitude + 0.01,
    }),
  ).toEqual({ distanceNauticalMiles: 0.4, bearingDegrees: 90 });
});

test("returns no range when location or aircraft position is absent", () => {
  expect(calculateAircraftRange(null, { latitude: 1, longitude: 1 })).toBeNull();
  expect(calculateAircraftRange(origin, { latitude: null, longitude: 1 })).toBeNull();
  expect(calculateAircraftRange(origin, { latitude: 1, longitude: undefined })).toBeNull();
});

test("normalizes bearings and handles opposite points", () => {
  expect(
    calculateAircraftRange(origin, { latitude: origin.latitude, longitude: origin.longitude }),
  ).toEqual({
    distanceNauticalMiles: 0,
    bearingDegrees: 0,
  });
  const opposite = calculateAircraftRange(
    { latitude: 0, longitude: 0 },
    { latitude: 0, longitude: 180 },
  );
  expect(opposite.distanceNauticalMiles).toBeGreaterThan(10000);
  expect(opposite.bearingDegrees).toBe(90);
});
