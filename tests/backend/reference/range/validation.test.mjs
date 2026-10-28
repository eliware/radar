import { expect, test } from "@jest/globals";
import { isValidRangeBand } from "../../../../src/backend/reference/range/validation.mjs";

test.each([
  [0, 300],
  [10, 20],
])("accepts range band %i to %i nautical miles", (minimum, maximum) => {
  expect(isValidRangeBand(minimum, maximum)).toBe(true);
});

test.each([
  [Number.NaN, 20],
  [0, Number.POSITIVE_INFINITY],
  [-1, 20],
  [20, 20],
  [21, 20],
  [0, 301],
])("rejects invalid range band %s to %s nautical miles", (minimum, maximum) => {
  expect(isValidRangeBand(minimum, maximum)).toBe(false);
});
