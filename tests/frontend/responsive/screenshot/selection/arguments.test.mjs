import { expect, test } from "@jest/globals";
import { parseScreenshotArguments } from "../../../../../src/frontend/responsive/screenshot/selection/arguments.mjs";

test("parses the primary screenshot option", () => {
  expect(parseScreenshotArguments()).toEqual([]);
  expect(parseScreenshotArguments(["--primary"])).toEqual([{ name: "primary" }]);
  expect(parseScreenshotArguments(["mobile", "--primary"])).toEqual([{ name: "primary" }]);
});
