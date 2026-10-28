import { expect, test } from "@jest/globals";
import {
  calculateFlightStripWidths,
  flightStripGroupTableWidth,
  flightStripTableWidth,
  minimumFlightStripWidths,
  wideTableWidth,
} from "../../../../src/cli/flight/strip/sizing.mjs";

test("calculates individual, grouped, and wide table widths", () => {
  expect(flightStripTableWidth([3, 4])).toBe(14);
  expect(flightStripGroupTableWidth([[0, 1], [2]], [3, 4, 8])).toBe(14);
  expect(wideTableWidth).toBe(156);
});

test("calculates minimum column widths", () => {
  expect(minimumFlightStripWidths(false)).toHaveLength(11);
  expect(minimumFlightStripWidths(false, [["LONGCALL"]])[0]).toBe(8);
});

test("distributes available widths evenly and squeezes narrow columns", () => {
  expect(calculateFlightStripWidths([0, 1], [4, 4], 20)).toEqual([7, 6]);
  expect(calculateFlightStripWidths([0, 1], [4, 4], 10)).toEqual([2, 1]);
});
