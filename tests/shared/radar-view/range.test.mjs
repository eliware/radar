import { expect, test } from "@jest/globals";
import { parseRadarRangeSetting } from "../../../src/shared/radar-view/range.mjs";

test("accepts numeric values as well as environment strings", () => {
  expect(parseRadarRangeSetting(25.5)).toBe(25.5);
});
