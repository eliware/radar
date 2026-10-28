import { expect, test } from "@jest/globals";
import { formatMetarAgeDisplay } from "../../../../src/frontend/metar/age/display.mjs";

const now = new Date("2026-10-13T18:00:00Z");

test("formats report age and stale status together", () => {
  expect(formatMetarAgeDisplay("13 17:00Z", now)).toEqual({ text: "1h", statusClass: "" });
  expect(formatMetarAgeDisplay("13 16:59Z", now)).toEqual({
    text: "1h1m",
    statusClass: " metar-age-old",
  });
});
