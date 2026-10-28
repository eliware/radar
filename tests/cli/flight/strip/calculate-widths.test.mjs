import { expect, test } from "@jest/globals";
import { calculateFlightStripWidths } from "../../../../src/cli/flight/strip/calculate-widths.mjs";

test("distributes available widths evenly and squeezes narrow columns", () => {
  expect(calculateFlightStripWidths([0, 1], [4, 4], 20)).toEqual([7, 6]);
  expect(calculateFlightStripWidths([0, 1], [4, 4], 10)).toEqual([2, 1]);
});
