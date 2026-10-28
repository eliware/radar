import { expect, test } from "@jest/globals";
import { tableRow } from "../../../../../src/cli/flight/strip/table/row.mjs";

test("formats flight strip table rows", () => {
  expect(tableRow(["A", "B"], [2, 2])).toBe("║ A  ║  B ║");
  expect(tableRow(["A"], [2], "│", "┼", "│")).toBe("│ A  │");
});
