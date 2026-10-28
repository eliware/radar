import { expect, test } from "@jest/globals";
import { mapIlsApproachRows } from "../../../../src/backend/ils/approach/mapper.mjs";
import { distanceNauticalMiles } from "../../../../src/shared/distance-nautical-miles.mjs";

const location = { latitude: 0, longitude: 0 };
const row = (latitude, longitude, runwayEnd = "18") => ({
  faaId: "PWM",
  runwayEnd,
  identifier: "PWM",
  systemType: "LD",
  latitude,
  longitude,
});

test("maps in-range approaches and attaches markers by ILS system", () => {
  const approach = row(0.5, 0);
  const markers = [{ identifier: "PWM" }];
  const markerIndex = new Map([["PWM:18:PWM:LD", markers]]);
  const rangeNm = distanceNauticalMiles(location, approach);
  expect(mapIlsApproachRows([approach], location, 20, 40, markerIndex)).toEqual([
    { ...approach, rangeNm, markers },
  ]);
  expect(mapIlsApproachRows([approach], location, 0, 40, new Map())[0].markers).toEqual([]);
});

test("filters invalid coordinates and approaches outside the requested range band", () => {
  const candidates = [
    row(Number.NaN, 0),
    row(0, Number.NaN),
    row(0.1, 0),
    row(1 / 60, 0),
    row(1, 0),
  ];
  expect(mapIlsApproachRows(candidates, location, 10, 50, new Map())).toEqual([]);
});

test("excludes an approach exactly on a nonzero lower range boundary", () => {
  const approach = row(0.5, 0);
  const boundary = distanceNauticalMiles(location, approach);
  expect(mapIlsApproachRows([approach], location, boundary, boundary, new Map())).toEqual([]);
});
