import { expect, jest, test } from "@jest/globals";
import { createScreenshotCliCaptureOptions } from "../../../../../src/frontend/responsive/screenshot/cli/capture-options.mjs";

test("combines selected screenshot settings with capture dependencies", () => {
  const browserLauncher = { launch: jest.fn() };
  const browserArgs = ["--test"];
  const fetcher = jest.fn();
  const files = { mkdir: jest.fn(), stat: jest.fn() };
  const report = jest.fn();
  expect(
    createScreenshotCliCaptureOptions(
      ["--primary"],
      {
        RADAR_SCREENSHOT_URL: "https://radar.example",
        RADAR_SCREENSHOT_DIR: "shots",
        RADAR_SCREENSHOT_MODES: "full-page",
      },
      { browserLauncher, browserArgs, fetcher, files, delayMs: 0, report },
    ),
  ).toEqual({
    baseUrl: "https://radar.example",
    outputDir: "shots",
    targets: [expect.objectContaining({ name: "desktop-primary" })],
    modes: ["full-page"],
    browserLauncher,
    browserArgs,
    fetcher,
    files,
    delayMs: 0,
    report,
  });
});
