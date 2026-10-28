import { expect, test } from "@jest/globals";
import { createScreenshotLaunchOptions } from "../../../../src/frontend/responsive/screenshot/launcher.mjs";

test("uses default launch locations", () => {
  expect(createScreenshotLaunchOptions()).toEqual({
    baseUrl: "http://127.0.0.1:3000",
    outputDir: "artifacts/screenshots",
    targets: expect.any(Array),
    modes: expect.any(Array),
  });
});

test("uses CLI selections and configured launch locations", () => {
  const options = createScreenshotLaunchOptions(["--primary"], {
    RADAR_SCREENSHOT_URL: "https://radar.example",
    RADAR_SCREENSHOT_DIR: "output/shots",
    RADAR_SCREENSHOT_MODES: "full-page",
  });
  expect(options).toMatchObject({
    baseUrl: "https://radar.example",
    outputDir: "output/shots",
  });
});
