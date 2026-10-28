import { expect, test } from "@jest/globals";
import { selectScreenshotOptions } from "../../../../src/frontend/responsive/screenshot/selection.mjs";

test("uses the default targets and screenshot modes", () => {
  const previousViewports = process.env.RADAR_SCREENSHOT_VIEWPORTS;
  const previousModes = process.env.RADAR_SCREENSHOT_MODES;
  delete process.env.RADAR_SCREENSHOT_VIEWPORTS;
  delete process.env.RADAR_SCREENSHOT_MODES;
  try {
    const selection = selectScreenshotOptions();
    expect(selection.targets).toHaveLength(6);
    expect(selection.modes).toEqual(["above-fold", "full-page"]);
  } finally {
    if (previousViewports === undefined) delete process.env.RADAR_SCREENSHOT_VIEWPORTS;
    else process.env.RADAR_SCREENSHOT_VIEWPORTS = previousViewports;
    if (previousModes === undefined) delete process.env.RADAR_SCREENSHOT_MODES;
    else process.env.RADAR_SCREENSHOT_MODES = previousModes;
  }
});

test("combines configured viewport and mode selections", () => {
  const selection = selectScreenshotOptions([], {
    RADAR_SCREENSHOT_VIEWPORTS: "desktop-1080p",
    RADAR_SCREENSHOT_MODES: "full-page",
  });
  expect(selection.targets.map(({ name }) => name)).toEqual(["desktop-1080p"]);
  expect(selection.modes).toEqual(["full-page"]);
});

test("uses configured viewports unless the primary option is present", () => {
  const selection = selectScreenshotOptions([], {
    RADAR_SCREENSHOT_VIEWPORTS: "iphone-12-portrait",
  });
  expect(selection.targets.map(({ name }) => name)).toEqual(["iphone-12-portrait"]);
});
