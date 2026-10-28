import { expect, test } from "@jest/globals";
import { flightStripTitleWidth } from "../../../../../src/cli/flight/strip/title/width.mjs";

test("calculates a title row width", () => {
  expect(flightStripTitleWidth([7, 9])).toBe(19);
});
