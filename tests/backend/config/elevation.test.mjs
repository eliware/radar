import { expect, test } from "@jest/globals";
import { parseElevation } from "../../../src/backend/config/elevation.mjs";

test("parses finite elevation values", () => {
  expect(parseElevation("300")).toBe(300);
  expect(parseElevation("-20.5")).toBe(-20.5);
});

test.each(["bad", "Infinity", "NaN"])("rejects invalid elevation %s", (value) => {
  expect(() => parseElevation(value)).toThrow("ADSB_ALT must be a number of feet.");
});
