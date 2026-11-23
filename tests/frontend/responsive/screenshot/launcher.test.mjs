import { expect, test } from "@jest/globals";
import { default as createScreenshotLaunchOptions } from "../../../../src/frontend/responsive/screenshot/launcher.mjs";

test("uses default launch locations", () => {
  expect(createScreenshotLaunchOptions()).toEqual({
    baseUrl: "http://127.0.0.1:1390",
    outputDir: "artifacts/screenshots",
    targets: expect.any(Array),
    modes: expect.any(Array),
  });
});

test("uses configured launch locations", () => {
  const options = createScreenshotLaunchOptions([], {
    RADAR_SCREENSHOT_URL: "https://radar.example",
    RADAR_SCREENSHOT_DIR: "output/shots",
  });
  expect(options).toMatchObject({
    baseUrl: "https://radar.example",
    outputDir: "output/shots",
  });
});
