import { expect, test } from "@jest/globals";
import { tableBorder, tableRow } from "../../../../src/cli/flight/strip/table.mjs";

test("draws matching borders and rows", () => {
  expect(tableBorder([2, 3], "╔", "╦", "╗", "═")).toBe("╔════╦═════╗");
  expect(tableBorder([2, 3], "╔", "╦", "╗", "═", 1)).toBe("╔════╪═════╗");
  expect(tableRow(["A", "B"], [2, 2])).toBe("║ A  ║  B ║");
  expect(tableRow(["A"], [2], "│", "┼", "│")).toBe("│ A  │");
});
