import { expect, test } from "@jest/globals";
import { readScreenshotSelectionOptions } from "../../../../../src/frontend/responsive/screenshot/selection/options.mjs";

test("selects primary viewport when the option is present", () => {
  expect(
    readScreenshotSelectionOptions(["--primary"], { RADAR_SCREENSHOT_VIEWPORTS: "mobile" }),
  ).toEqual({
    viewportSelection: "desktop-primary",
    modeSelection: "above-fold,full-page",
  });
});

test("reads viewport and mode selections from the environment", () => {
  expect(
    readScreenshotSelectionOptions([], {
      RADAR_SCREENSHOT_VIEWPORTS: "mobile",
      RADAR_SCREENSHOT_MODES: "full-page",
    }),
  ).toEqual({ viewportSelection: "mobile", modeSelection: "full-page" });
});

test("uses parser defaults when arguments and environment are omitted", () => {
  const previousViewports = process.env.RADAR_SCREENSHOT_VIEWPORTS;
  const previousModes = process.env.RADAR_SCREENSHOT_MODES;
  delete process.env.RADAR_SCREENSHOT_VIEWPORTS;
  delete process.env.RADAR_SCREENSHOT_MODES;
  try {
    expect(readScreenshotSelectionOptions()).toEqual({
      viewportSelection: "all",
      modeSelection: "above-fold,full-page",
    });
  } finally {
    if (previousViewports === undefined) delete process.env.RADAR_SCREENSHOT_VIEWPORTS;
    else process.env.RADAR_SCREENSHOT_VIEWPORTS = previousViewports;
    if (previousModes === undefined) delete process.env.RADAR_SCREENSHOT_MODES;
    else process.env.RADAR_SCREENSHOT_MODES = previousModes;
  }
});
