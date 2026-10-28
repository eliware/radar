import { expect, test } from "@jest/globals";
import { selectScreenshotBrowserArgs } from "../../../../../src/frontend/responsive/screenshot/browser/launch-options.mjs";

test("selects browser flags for root and non-root processes", () => {
  expect(selectScreenshotBrowserArgs()).toEqual(
    process.getuid?.() === 0 ? ["--no-sandbox", "--disable-setuid-sandbox"] : [],
  );
  expect(selectScreenshotBrowserArgs(0)).toEqual(["--no-sandbox", "--disable-setuid-sandbox"]);
  expect(selectScreenshotBrowserArgs(1000)).toEqual([]);
});
