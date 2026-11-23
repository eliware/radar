import { expect, test } from "@jest/globals";
import { default as createScreenshotCliOptions } from "../../../../../src/frontend/responsive/screenshot/cli/options.mjs";

test("selects screenshot settings from CLI arguments and environment values", () => {
  expect(
    createScreenshotCliOptions(["--primary"], {
      RADAR_SCREENSHOT_URL: "https://radar.example",
      RADAR_SCREENSHOT_DIR: "shots",
      RADAR_SCREENSHOT_MODES: "full-page",
    }),
  ).toEqual({
    baseUrl: "https://radar.example",
    outputDir: "shots",
    targets: [expect.objectContaining({ name: "desktop-primary" })],
    modes: ["full-page"],
  });
});
