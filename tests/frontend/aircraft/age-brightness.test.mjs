import { expect, test } from "@jest/globals";
import { getAircraftAgeBrightness } from "../../../src/frontend/aircraft/age-brightness.mjs";

test("fades from full brightness to invisible over the tracking timeout", () => {
  expect(getAircraftAgeBrightness(1000, 1000)).toBe(1);
  expect(getAircraftAgeBrightness(1000, 61_000)).toBe(0.5);
  expect(getAircraftAgeBrightness(1000, 121_000)).toBe(0);
  expect(getAircraftAgeBrightness(1000, 122_000)).toBe(0);
});

test("keeps full brightness when the receive time is unavailable", () => {
  expect(getAircraftAgeBrightness(undefined, 1000)).toBe(1);
});
