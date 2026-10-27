import { expect, test } from "@jest/globals";
import { fitCell, tableBorder, tableRow } from "../../../../src/cli/flight/strip/table.mjs";

test("fits, pads, and truncates table cells", () => {
  expect(fitCell(undefined, 4)).toBe("-   ");
  expect(fitCell("ok", 4)).toBe("ok  ");
  expect(fitCell("long", 3)).toBe("lo…");
});

test("draws matching borders and rows", () => {
  expect(tableBorder([2, 3], "╔", "╦", "╗", "═")).toBe("╔════╦═════╗");
  expect(tableRow(["A", "B"], [2, 2])).toBe("║ A  ║  B ║");
  expect(tableRow(["A"], [2], "│", "┼", "│")).toBe("│ A  │");
});
