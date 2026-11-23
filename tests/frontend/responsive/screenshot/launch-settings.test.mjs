import { expect, test } from "@jest/globals";
import { default as createScreenshotLaunchSettings } from "../../../../src/frontend/responsive/screenshot/launch-settings.mjs";

test("uses default server and output locations", () => {
  expect(createScreenshotLaunchSettings({})).toEqual({
    baseUrl: "http://127.0.0.1:1390",
    outputDir: "artifacts/screenshots",
  });
});

test("uses configured server and output locations", () => {
  expect(
    createScreenshotLaunchSettings({
      RADAR_SCREENSHOT_URL: "https://radar.example",
      RADAR_SCREENSHOT_DIR: "output/shots",
    }),
  ).toEqual({
    baseUrl: "https://radar.example",
    outputDir: "output/shots",
  });
});
