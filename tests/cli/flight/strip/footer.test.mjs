import { expect, test } from "@jest/globals";
import { flightStripFooter } from "../../../../src/cli/flight/strip/footer.mjs";
import { createFlightStripLayout } from "../../../../src/cli/flight/strip/layout-selection.mjs";
import { horizontalRule } from "../../../../src/cli/flight/strip/rule.mjs";

test("formats single and wrapped table footers", () => {
  expect(flightStripFooter(createFlightStripLayout(180), 180)).toContain("╧");
  expect(flightStripFooter(createFlightStripLayout(40), 40)).toBe(
    horizontalRule(40, "╚", "╝", "═"),
  );
});
