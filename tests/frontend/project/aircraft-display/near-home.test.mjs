import { expect, test } from "@jest/globals";
import { isAircraftDisplayNearHome } from "../../../../src/frontend/project/aircraft-display/near-home.mjs";

const home = { latitude: 43, longitude: -70 };

test("classifies a projected pass near home", () => {
  const aircraft = {
    latitude: home.latitude - 2 / 60,
    longitude: home.longitude,
    altitudeFeet: 1000,
    trackDegrees: 0,
    groundSpeedKnots: 120,
    verticalRateFeetPerMinute: 0,
  };
  expect(isAircraftDisplayNearHome(aircraft, home, 0)).toBe(true);
});

test("does not classify aircraft without usable altitude or location", () => {
  expect(isAircraftDisplayNearHome({ latitude: 43, longitude: -70 }, home, 0)).toBe(false);
  expect(isAircraftDisplayNearHome({}, null, 0)).toBe(false);
});
