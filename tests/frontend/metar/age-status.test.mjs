import { expect, test } from "@jest/globals";
import { metarAgeStatusClass } from "../../../src/frontend/metar/age-status.mjs";

const now = new Date("2026-10-13T18:00:00Z");

test("marks reports stale only after one hour", () => {
  expect(metarAgeStatusClass("13 17:00Z", now)).toBe("");
  expect(metarAgeStatusClass("13 16:59Z", now)).toBe(" metar-age-old");
});

test("leaves unparseable observation times without a stale class", () => {
  expect(metarAgeStatusClass(null, now)).toBe("");
});
