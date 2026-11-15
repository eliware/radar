import { expect, test } from "@jest/globals";
import { isAircraftProjectedNearHome } from "../../../../src/frontend/aircraft/near-home/is-projected-near-home.mjs";

const home = { latitude: 43, longitude: -70 };

function aircraft({ northNm = 0, eastNm = 0, altitudeFeet = 1000 } = {}) {
  return {
    latitude: home.latitude + northNm / 60,
    longitude: home.longitude + eastNm / (60 * Math.cos((home.latitude * Math.PI) / 180)),
    altitudeFeet,
    trackDegrees: 0,
    groundSpeedKnots: 120,
    verticalRateFeetPerMinute: 0,
  };
}

test("rejects missing aircraft data before projecting a path", () => {
  expect(isAircraftProjectedNearHome(null, home)).toBe(false);
});

test("detects a projected pass within one nautical mile and 2,000 feet AGL", () => {
  expect(isAircraftProjectedNearHome(aircraft({ northNm: -2 }), home, 0)).toBe(true);
});

test("rejects projected paths outside horizontal, altitude, or input limits", () => {
  expect(isAircraftProjectedNearHome(aircraft({ eastNm: 1.1 }), home, 0)).toBe(false);
  expect(isAircraftProjectedNearHome(aircraft({ altitudeFeet: 2001 }), home, 0)).toBe(false);
  expect(
    isAircraftProjectedNearHome({ latitude: home.latitude, longitude: home.longitude }, home, 0),
  ).toBe(false);
  expect(isAircraftProjectedNearHome(aircraft({}), null, 0)).toBe(false);
});

test("measures projected pass altitude above home elevation", () => {
  expect(
    isAircraftProjectedNearHome(aircraft({ altitudeFeet: 4500, northNm: -2 }), home, 4500),
  ).toBe(true);
});

test("uses zero home elevation when the elevation setting is omitted", () => {
  expect(isAircraftProjectedNearHome(aircraft({ northNm: -2 }), home)).toBe(true);
});
