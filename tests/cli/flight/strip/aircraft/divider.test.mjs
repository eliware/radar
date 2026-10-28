import { expect, test } from "@jest/globals";
import { aircraftDivider } from "../../../../../src/cli/flight/strip/aircraft/divider.mjs";
import { createFlightStripLayout } from "../../../../../src/cli/flight/strip/layout-selection.mjs";
import { horizontalRule } from "../../../../../src/cli/flight/strip/rule.mjs";

test("formats single and wrapped table dividers", () => {
  expect(aircraftDivider(createFlightStripLayout(180), 180)).toContain("┼");
  expect(aircraftDivider(createFlightStripLayout(40), 40)).toBe(horizontalRule(40, "╟", "╢", "─"));
});
