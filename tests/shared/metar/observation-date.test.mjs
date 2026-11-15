import { expect, test } from "@jest/globals";
import { selectMetarObservationDate } from "../../../src/shared/metar/observation-date.mjs";

test("selects the previous month for a METAR day later than today's date", () => {
  expect(selectMetarObservationDate(30, new Date("2026-10-01T00:10:00Z")).toISOString()).toBe(
    "2026-09-30T00:00:00.000Z",
  );
});

test("rolls back across a year boundary", () => {
  expect(selectMetarObservationDate(31, new Date("2026-01-01T00:10:00Z")).toISOString()).toBe(
    "2025-12-31T00:00:00.000Z",
  );
});

test("finds the prior occurrence when the previous month had fewer days", () => {
  expect(selectMetarObservationDate(31, new Date("2026-10-01T00:10:00Z")).toISOString()).toBe(
    "2026-08-31T00:00:00.000Z",
  );
});
