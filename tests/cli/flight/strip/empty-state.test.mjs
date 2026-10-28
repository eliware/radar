import { expect, test } from "@jest/globals";
import { createFlightStripLayout } from "../../../../src/cli/flight/strip/layout-selection.mjs";
import { renderFlightStripEmptyState } from "../../../../src/cli/flight/strip/empty-state.mjs";

test("renders a waiting message across the selected table width", () => {
  const row = renderFlightStripEmptyState(createFlightStripLayout(80)[0].widths);
  expect(row).toContain("Waiting for aircraft...");
  expect(row).toHaveLength(80);
});
