import { expect, test } from "@jest/globals";
import { minimumFlightStripWidths } from "../../../../src/cli/flight/strip/minimum-widths.mjs";

test("calculates minimum column widths from defaults and rows", () => {
  expect(minimumFlightStripWidths(false)).toHaveLength(11);
  expect(minimumFlightStripWidths(false, [["LONGCALL"]])[0]).toBe(8);
});
