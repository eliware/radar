import { expect, test } from "@jest/globals";
import { allocateFlightStripLayoutWidths } from "../../../../../src/cli/flight/strip/layout/widths.mjs";

test("allocates width across every selected row group", () => {
  expect(allocateFlightStripLayoutWidths([[0, 1], [2]], [4, 4, 3], 20)).toEqual([[7, 6], [16]]);
});

test("squeezes selected columns when their minimum widths exceed the terminal", () => {
  expect(allocateFlightStripLayoutWidths([[0, 1]], [4, 4], 10)).toEqual([[2, 1]]);
});
