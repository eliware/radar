import { expect, test } from "@jest/globals";
import { metarAgeStatusClass } from "../../../../src/frontend/metar/age/status.mjs";

const now = new Date("2026-10-13T18:00:00Z");

test("leaves recent reports without a stale class", () => {
  expect(metarAgeStatusClass("13 17:30Z", now)).toBe("");
});
