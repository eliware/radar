import { expect, test } from "@jest/globals";
import { isAircraftProjectedNearHome } from "../../src/frontend/aircraft-near-home-pass.mjs";

const home = { latitude: 43, longitude: -70 };

function aircraft({
  northNm = 0,
  eastNm = 0,
  altitudeFeet = 1000,
  trackDegrees = 0,
  speed = 120,
} = {}) {
  return {
    latitude: home.latitude + northNm / 60,
    longitude: home.longitude + eastNm / (60 * Math.cos((home.latitude * Math.PI) / 180)),
    altitudeFeet,
    trackDegrees,
    groundSpeedKnots: speed,
    verticalRateFeetPerMinute: 0,
  };
}

test("detects a projected pass within one nautical mile and 2,000 feet AGL", () => {
  expect(isAircraftProjectedNearHome(aircraft({ northNm: -2 }), home, 0)).toBe(true);
});

test("does not flag paths outside the horizontal or altitude limits", () => {
  expect(isAircraftProjectedNearHome(aircraft({ eastNm: 1.1 }), home, 0)).toBe(false);
  expect(isAircraftProjectedNearHome(aircraft({ altitudeFeet: 2001 }), home, 0)).toBe(false);
  expect(isAircraftProjectedNearHome(aircraft({}), null, 0)).toBe(false);
});

test("detects the part of a descending projected path below the altitude limit", () => {
  const descending = {
    ...aircraft({ northNm: -0.8, altitudeFeet: 2300 }),
    verticalRateFeetPerMinute: -400,
  };
  expect(isAircraftProjectedNearHome(descending, home, 0)).toBe(true);
});

test("limits an ascending path to its portion below the altitude ceiling", () => {
  const ascending = {
    ...aircraft({ altitudeFeet: 1000 }),
    verticalRateFeetPerMinute: 3000,
  };
  expect(isAircraftProjectedNearHome(ascending, home, 0)).toBe(true);
});

test("checks a stationary aircraft at the home point", () => {
  expect(isAircraftProjectedNearHome(aircraft({ speed: 0 }), home, 0)).toBe(true);
});
