import { expect, test } from "@jest/globals";
import { flightStripGroupTableWidth } from "../../../../src/cli/flight/strip/group-table-width.mjs";

test("calculates the maximum width across table groups", () => {
  expect(flightStripGroupTableWidth([[0, 1], [2]], [3, 4, 8])).toBe(14);
});
