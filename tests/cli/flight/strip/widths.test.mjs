import { expect, test } from "@jest/globals";
import {
  calculateFlightStripWidths,
  flightStripTableWidth,
  minimumFlightStripWidths,
  wideTableWidth,
} from "../../../../src/cli/flight/strip/widths.mjs";

test("calculates the full table width and minimum column widths", () => {
  expect(wideTableWidth).toBe(156);
  expect(flightStripTableWidth([3, 4])).toBe(14);
  expect(minimumFlightStripWidths(false)).toHaveLength(11);
  expect(minimumFlightStripWidths(false, [["LONGCALL"]])[0]).toBe(8);
});

test("distributes available widths evenly and squeezes narrow columns", () => {
  expect(calculateFlightStripWidths([0, 1], [4, 4], 20)).toEqual([7, 6]);
  expect(calculateFlightStripWidths([0, 1], [4, 4], 10)).toEqual([2, 1]);
});
