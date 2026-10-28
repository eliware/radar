import { expect, test } from "@jest/globals";
import { tableBorder } from "../../../../src/cli/flight/strip/table.mjs";

test("draws matching borders and rows", () => {
  expect(tableBorder([2, 3], "╔", "╦", "╗", "═")).toBe("╔════╦═════╗");
  expect(tableBorder([2, 3], "╔", "╦", "╗", "═", 1)).toBe("╔════╪═════╗");
});
