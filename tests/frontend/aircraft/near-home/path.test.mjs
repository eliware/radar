import { expect, test } from "@jest/globals";
import { isPredictedAircraftPathNearHome } from "../../../../src/frontend/aircraft/near-home/path.mjs";

const feetPerNauticalMile = 6076.12;
const ceiling = 2000 / feetPerNauticalMile;

test("detects a descending path where its low-altitude segment passes near home", () => {
  expect(
    isPredictedAircraftPathNearHome(
      { x: -1.2, y: 2400 / feetPerNauticalMile, z: 0 },
      { x: 0.5, y: 0, z: 0 },
    ),
  ).toBe(true);
});

test("clips an ascending path at the altitude ceiling", () => {
  expect(
    isPredictedAircraftPathNearHome(
      { x: -3, y: 1000 / feetPerNauticalMile, z: 0 },
      { x: 0, y: 3000 / feetPerNauticalMile, z: 0 },
    ),
  ).toBe(false);
});

test("rejects paths above the ceiling and paths outside one nautical mile", () => {
  expect(
    isPredictedAircraftPathNearHome({ x: 0, y: ceiling + 1, z: 0 }, { x: 0, y: 2, z: 0 }),
  ).toBe(false);
  expect(isPredictedAircraftPathNearHome({ x: 1.1, y: 0, z: 0 }, { x: 2, y: 0, z: 0 })).toBe(false);
});

test("detects stationary paths at the home point", () => {
  expect(
    isPredictedAircraftPathNearHome({ x: 0, y: ceiling, z: 0 }, { x: 0, y: ceiling, z: 0 }),
  ).toBe(true);
});
