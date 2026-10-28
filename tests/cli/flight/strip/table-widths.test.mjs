import { expect, test } from "@jest/globals";
import {
  flightStripGroupTableWidth,
  flightStripTableWidth,
  wideTableWidth,
} from "../../../../src/cli/flight/strip/table-widths.mjs";

test("calculates individual, grouped, and wide table widths", () => {
  expect(flightStripTableWidth([3, 4])).toBe(14);
  expect(flightStripGroupTableWidth([[0, 1], [2]], [3, 4, 8])).toBe(14);
  expect(wideTableWidth).toBe(156);
});
