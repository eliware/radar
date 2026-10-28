import { expect, test } from "@jest/globals";
import { fitCell } from "../../../../src/cli/flight/strip/cell.mjs";

test("fits, pads, and truncates table cells", () => {
  expect(fitCell(undefined, 4)).toBe("-   ");
  expect(fitCell("ok", 4)).toBe("ok  ");
  expect(fitCell("long", 3)).toBe("lo…");
});
