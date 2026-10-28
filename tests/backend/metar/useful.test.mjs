import { expect, test } from "@jest/globals";
import { hasUsefulMetarData } from "../../../src/backend/metar/useful.mjs";

test("rejects decoded reports with no useful field values", () => {
  expect(hasUsefulMetarData({ wind: "—", category: null, automated: false })).toBe(false);
});

test("accepts a decoded report when any field contains useful data", () => {
  expect(hasUsefulMetarData({ wind: "—", category: null, observed: "13 16:51Z" })).toBe(true);
  expect(hasUsefulMetarData({ automated: true })).toBe(true);
});
