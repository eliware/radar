import { expect, test } from "@jest/globals";
import { default as getMetarAgeMinutes } from "../../../src/shared/metar/age.mjs";

test("calculates METAR age and handles invalid observations", () => {
  const now = new Date("2026-10-13T18:00:00Z");
  expect(getMetarAgeMinutes("13 17:00Z", now)).toBe(60);
  expect(getMetarAgeMinutes("13 16:59Z", now)).toBe(61);
  expect(getMetarAgeMinutes("bad", now)).toBeNull();
  expect(getMetarAgeMinutes("99 12:00Z", now)).toBeNull();
  expect(getMetarAgeMinutes("13 24:00Z", now)).toBeNull();
  expect(getMetarAgeMinutes("13 12:60Z", now)).toBeNull();
  expect(getMetarAgeMinutes("bad")).toBeNull();
});

test("clamps future observations to zero age", () => {
  expect(getMetarAgeMinutes("13 23:00Z", new Date("2026-10-13T18:00:00Z"))).toBe(0);
});
