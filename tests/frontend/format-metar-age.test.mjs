import { expect, test } from "@jest/globals";
import { formatMetarAge, getMetarAgeMinutes } from "../../src/frontend/format-metar-age.mjs";

test("formats report age as minutes or hours and minutes", () => {
  const now = new Date("2026-10-13T18:00:00Z");
  expect(formatMetarAge("13 17:50Z", now)).toBe("10m");
  expect(formatMetarAge("13 16:50Z", now)).toBe("1h10m");
  expect(formatMetarAge("12 23:00Z", now)).toBe("19h");
});

test("returns age in minutes and leaves invalid observations unknown", () => {
  const now = new Date("2026-10-13T18:00:00Z");
  expect(getMetarAgeMinutes("13 17:00Z", now)).toBe(60);
  expect(getMetarAgeMinutes("13 16:59Z", now)).toBe(61);
  expect(getMetarAgeMinutes("bad", now)).toBeNull();
});

test("uses the current time when no reference time is provided", () => {
  expect(getMetarAgeMinutes("bad")).toBeNull();
  expect(formatMetarAge("bad")).toBe("—");
});

test("handles month and year rollover and future observations", () => {
  expect(formatMetarAge("30 23:00Z", new Date("2026-10-01T00:10:00Z"))).toBe("1h10m");
  expect(formatMetarAge("31 23:00Z", new Date("2026-01-01T00:10:00Z"))).toBe("1h10m");
  expect(formatMetarAge("13 23:00Z", new Date("2026-10-13T18:00:00Z"))).toBe("0m");
  expect(formatMetarAge("bad", new Date("2026-10-13T18:00:00Z"))).toBe("—");
  expect(formatMetarAge(null, new Date("2026-10-13T18:00:00Z"))).toBe("—");
});
