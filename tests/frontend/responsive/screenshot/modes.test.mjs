import { expect, test } from "@jest/globals";
import { selectScreenshotModes } from "../../../../src/frontend/responsive/screenshot/modes.mjs";

test("selects default and requested screenshot modes", () => {
  expect(selectScreenshotModes()).toEqual(["above-fold", "full-page"]);
  expect(selectScreenshotModes("full-page, above-fold")).toEqual(["full-page", "above-fold"]);
});

test("rejects unknown screenshot modes", () => {
  expect(() => selectScreenshotModes("unknown")).toThrow("Unknown screenshot mode");
});
