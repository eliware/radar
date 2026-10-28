import { expect, test } from "@jest/globals";
import { flightStripColumns } from "../../../../src/cli/flight/strip/columns.mjs";

test("defines each flight strip column with full and compact labels and widths", () => {
  expect(flightStripColumns).toHaveLength(11);
  expect(flightStripColumns[0]).toEqual(["CALLSIGN", "CALL", 10, 6]);
  expect(flightStripColumns[5]).toEqual(["VERTICAL RATE", "VS", 14, 5]);
  expect(flightStripColumns[10]).toEqual(["AGE", "AGE", 7, 4]);
});
