import { expect, test } from "@jest/globals";
import { parseAdsbLolRetryAfter } from "../../../../../src/backend/aircraft/adsblol-remote/request/retry-after.mjs";

test("parses Retry-After delta seconds", () => {
  expect(parseAdsbLolRetryAfter("45")).toBe(45000);
});

test("parses Retry-After HTTP dates and clamps past dates to zero", () => {
  const now = Date.parse("2026-10-31T12:00:00.000Z");
  expect(parseAdsbLolRetryAfter("Sat, 31 Oct 2026 12:00:45 GMT", now)).toBe(45000);
  expect(parseAdsbLolRetryAfter("Sat, 31 Oct 2026 11:59:00 GMT", now)).toBe(0);
});

test.each([undefined, null, "", "not a date", "-1"])(
  "ignores invalid Retry-After value %s",
  (value) => {
    expect(parseAdsbLolRetryAfter(value)).toBeUndefined();
  },
);
