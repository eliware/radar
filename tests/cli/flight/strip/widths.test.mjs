import { expect, test } from "@jest/globals";
import {
  calculateFlightStripWidths,
  minimumFlightStripWidths,
} from "../../../../src/cli/flight/strip/widths.mjs";

test("calculates minimum column widths", () => {
  expect(minimumFlightStripWidths(false)).toHaveLength(11);
  expect(minimumFlightStripWidths(false, [["LONGCALL"]])[0]).toBe(8);
});

test("distributes available widths evenly and squeezes narrow columns", () => {
  expect(calculateFlightStripWidths([0, 1], [4, 4], 20)).toEqual([7, 6]);
  expect(calculateFlightStripWidths([0, 1], [4, 4], 10)).toEqual([2, 1]);
});
