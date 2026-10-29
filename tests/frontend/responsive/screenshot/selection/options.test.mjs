import { expect, test } from "@jest/globals";
import { createScreenshotSelectionOptions } from "../../../../../src/frontend/responsive/screenshot/selection/options.mjs";

test("combines configured viewport and mode values", () => {
  const options = createScreenshotSelectionOptions(false, {
    RADAR_SCREENSHOT_VIEWPORTS: "iphone-12-portrait",
    RADAR_SCREENSHOT_MODES: "full-page",
  });
  expect(options.targets.map(({ name }) => name)).toEqual(["iphone-12-portrait"]);
  expect(options.modes).toEqual(["full-page"]);
});

test("uses defaults and lets primary selection override configured viewports", () => {
  expect(createScreenshotSelectionOptions(false, {}).modes).toEqual(["above-fold", "full-page"]);
  const primary = createScreenshotSelectionOptions(true, {
    RADAR_SCREENSHOT_VIEWPORTS: "iphone-12-portrait",
    RADAR_SCREENSHOT_MODES: "full-page",
  });
  expect(primary.targets.map(({ name }) => name)).toEqual(["desktop-primary"]);
  expect(primary.modes).toEqual(["full-page"]);
});
