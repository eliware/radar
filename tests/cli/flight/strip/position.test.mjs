import { expect, test } from "@jest/globals";
import { formatAircraftPosition } from "../../../../src/cli/flight/strip/position.mjs";

test("formats valid coordinates to four decimal places", () => {
  expect(formatAircraftPosition({ latitude: 43.687459, longitude: -70.442504 })).toBe(
    "43.6875, -70.4425",
  );
});

test("returns null when either coordinate is invalid", () => {
  expect(formatAircraftPosition({ latitude: "43", longitude: -70 })).toBeNull();
  expect(formatAircraftPosition({ latitude: 43, longitude: Number.NaN })).toBeNull();
});
