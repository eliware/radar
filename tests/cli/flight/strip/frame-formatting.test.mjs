import { expect, test } from "@jest/globals";
import {
  aircraftDivider,
  flightStripFooter,
} from "../../../../src/cli/flight/strip/frame-formatting.mjs";
import { createFlightStripLayout } from "../../../../src/cli/flight/strip/layout-selection.mjs";
import { horizontalRule } from "../../../../src/cli/flight/strip/rule.mjs";

test("formats single-row table dividers and footers", () => {
  const layout = createFlightStripLayout(180);
  expect(aircraftDivider(layout, 180)).toContain("┼");
  expect(flightStripFooter(layout, 180)).toContain("╧");
});

test("formats wrapped table dividers and footers", () => {
  const layout = createFlightStripLayout(40);
  expect(aircraftDivider(layout, 40)).toBe(horizontalRule(40, "╟", "╢", "─"));
  expect(flightStripFooter(layout, 40)).toBe(horizontalRule(40, "╚", "╝", "═"));
});
