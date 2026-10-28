import { expect, test } from "@jest/globals";
import { readScreenshotSelectionInput } from "../../../../src/frontend/responsive/screenshot/selection-settings.mjs";

test("selects primary viewport when the option is present", () => {
  expect(
    readScreenshotSelectionInput(["--primary"], { RADAR_SCREENSHOT_VIEWPORTS: "mobile" }),
  ).toEqual({
    viewportSelection: "desktop-primary",
    modeSelection: "above-fold,full-page",
  });
});

test("reads viewport and mode selections from the environment", () => {
  expect(
    readScreenshotSelectionInput([], {
      RADAR_SCREENSHOT_VIEWPORTS: "mobile",
      RADAR_SCREENSHOT_MODES: "full-page",
    }),
  ).toEqual({ viewportSelection: "mobile", modeSelection: "full-page" });
});

test("uses the process arguments and environment by default", () => {
  const selection = readScreenshotSelectionInput();
  expect(typeof selection.viewportSelection).toBe("string");
  expect(typeof selection.modeSelection).toBe("string");
});
