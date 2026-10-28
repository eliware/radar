import { expect, test } from "@jest/globals";
import { parseScreenshotArguments } from "../../../../src/frontend/responsive/screenshot/arguments.mjs";

test("parses the primary screenshot option", () => {
  expect(parseScreenshotArguments()).toEqual({ primary: false });
  expect(parseScreenshotArguments(["--primary"])).toEqual({ primary: true });
  expect(parseScreenshotArguments([])).toEqual({ primary: false });
});
