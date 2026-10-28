import { expect, test } from "@jest/globals";
import { parseScreenshotArguments } from "../../../../../src/frontend/responsive/screenshot/selection/arguments.mjs";

test("returns the supported primary screenshot selection", () => {
  expect(parseScreenshotArguments()).toEqual({ primary: false });
  expect(parseScreenshotArguments(["--primary"])).toEqual({ primary: true });
  expect(() => parseScreenshotArguments(["--other"])).toThrow(
    "Unknown screenshot argument: --other",
  );
});
