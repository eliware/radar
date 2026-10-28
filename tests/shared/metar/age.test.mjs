import { expect, test } from "@jest/globals";
import { getMetarAgeMinutes } from "../../../src/shared/metar/age.mjs";

test("calculates METAR age and handles invalid observations", () => {
  const now = new Date("2026-10-13T18:00:00Z");
  expect(getMetarAgeMinutes("13 17:00Z", now)).toBe(60);
  expect(getMetarAgeMinutes("13 16:59Z", now)).toBe(61);
  expect(getMetarAgeMinutes("bad", now)).toBeNull();
  expect(getMetarAgeMinutes("bad")).toBeNull();
});

test("handles month and year rollover and future observations", () => {
  expect(getMetarAgeMinutes("30 23:00Z", new Date("2026-10-01T00:10:00Z"))).toBe(70);
  expect(getMetarAgeMinutes("31 23:00Z", new Date("2026-01-01T00:10:00Z"))).toBe(70);
  expect(getMetarAgeMinutes("13 23:00Z", new Date("2026-10-13T18:00:00Z"))).toBe(0);
});
