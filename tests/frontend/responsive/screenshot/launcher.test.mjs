import { expect, test } from "@jest/globals";
import { createScreenshotLaunchOptions } from "../../../../src/frontend/responsive/screenshot/launcher.mjs";

test("composes launch defaults and screenshot selections", () => {
  expect(createScreenshotLaunchOptions()).toEqual({
    baseUrl: "http://127.0.0.1:3000",
    outputDir: "artifacts/screenshots",
    targets: expect.arrayContaining([expect.objectContaining({ name: "desktop-primary" })]),
    modes: ["above-fold", "full-page"],
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
    modes: ["full-page"],
  });
  expect(options.targets.map(({ name }) => name)).toEqual(["desktop-primary"]);
});
