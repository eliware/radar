import { expect, test } from "@jest/globals";
import { selectScreenshotOptions } from "../../../../src/frontend/responsive/screenshot/selection.mjs";

test("uses default options when no arguments or environment are supplied", () => {
  const previousViewports = process.env.RADAR_SCREENSHOT_VIEWPORTS;
  const previousModes = process.env.RADAR_SCREENSHOT_MODES;
  delete process.env.RADAR_SCREENSHOT_VIEWPORTS;
  delete process.env.RADAR_SCREENSHOT_MODES;
  try {
    expect(selectScreenshotOptions().modes).toEqual(["above-fold", "full-page"]);
  } finally {
    if (previousViewports === undefined) delete process.env.RADAR_SCREENSHOT_VIEWPORTS;
    else process.env.RADAR_SCREENSHOT_VIEWPORTS = previousViewports;
    if (previousModes === undefined) delete process.env.RADAR_SCREENSHOT_MODES;
    else process.env.RADAR_SCREENSHOT_MODES = previousModes;
  }
});

test("orchestrates primary argument parsing with configured screenshot modes", () => {
  const selection = selectScreenshotOptions(["--primary"], {
    RADAR_SCREENSHOT_VIEWPORTS: "iphone-12-portrait",
    RADAR_SCREENSHOT_MODES: "full-page",
  });
  expect(selection.targets.map(({ name }) => name)).toEqual(["desktop-primary"]);
  expect(selection.modes).toEqual(["full-page"]);
});
