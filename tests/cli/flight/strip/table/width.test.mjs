import { expect, test } from "@jest/globals";
import {
  flightStripTableWidth,
  wideTableWidth,
} from "../../../../../src/cli/flight/strip/table/width.mjs";

test("calculates individual and wide table widths", () => {
  expect(flightStripTableWidth([3, 4])).toBe(14);
  expect(wideTableWidth).toBe(156);
});
