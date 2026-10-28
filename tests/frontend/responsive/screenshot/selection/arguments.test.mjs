import { expect, test } from "@jest/globals";
import { parseScreenshotArguments } from "../../../../../src/frontend/responsive/screenshot/selection/arguments.mjs";

test("detects the primary viewport option", () => {
  expect(parseScreenshotArguments()).toEqual({ primary: false });
  expect(parseScreenshotArguments(["--other"])).toEqual({ primary: false });
  expect(parseScreenshotArguments(["--primary"])).toEqual({ primary: true });
});
