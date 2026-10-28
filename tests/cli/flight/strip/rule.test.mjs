import { expect, test } from "@jest/globals";
import { horizontalRule } from "../../../../src/cli/flight/strip/rule.mjs";

test("fills the width between the supplied endpoints", () => {
  expect(horizontalRule(8, "╟", "╢", "─")).toBe("╟──────╢");
  expect(horizontalRule(4, "<", ">", "-")).toBe("<-->");
});
