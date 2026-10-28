import { expect, test } from "@jest/globals";
import { metarAgeStatusClass } from "../../../src/frontend/metar/age-status.mjs";

const now = new Date("2026-10-13T18:00:00Z");

test("adds the stale class for old reports", () => {
  expect(metarAgeStatusClass("13 16:59Z", now)).toBe(" metar-age-old");
});
