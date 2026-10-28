import { expect, test } from "@jest/globals";
import { parseScreenshotArguments } from "../../../../src/frontend/responsive/screenshot/arguments.mjs";

test("parses the primary viewport argument", () => {
  expect(parseScreenshotArguments()).toEqual({ primary: false });
  expect(parseScreenshotArguments(["--other"])).toEqual({ primary: false });
  expect(parseScreenshotArguments(["--primary"])).toEqual({ primary: true });
});
