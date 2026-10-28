import { expect, jest, test } from "@jest/globals";
import { createScreenshotCliOptions } from "../../../../src/frontend/responsive/screenshot/cli-options.mjs";

test("selects default capture dependencies and screenshot settings", () => {
  const { capture, captureOptions } = createScreenshotCliOptions({ args: [], environment: {} });
  expect(capture).toEqual(expect.any(Function));
  expect(captureOptions).toEqual(
    expect.objectContaining({
      baseUrl: "http://127.0.0.1:3000",
      outputDir: "artifacts/screenshots",
      targets: expect.any(Array),
      modes: ["above-fold", "full-page"],
      browserLauncher: expect.objectContaining({ launch: expect.any(Function) }),
      browserArgs: expect.any(Array),
      fetcher: expect.any(Function),
      files: expect.objectContaining({ mkdir: expect.any(Function), stat: expect.any(Function) }),
      delayMs: 500,
      report: console.log,
    }),
  );
});

test("uses process defaults when no CLI options are provided", () => {
  const previousArguments = process.argv;
  process.argv = [process.argv[0], process.argv[1]];
  try {
    const { capture, captureOptions } = createScreenshotCliOptions();
    expect(capture).toEqual(expect.any(Function));
    expect(captureOptions.baseUrl).toEqual(expect.any(String));
    expect(captureOptions.outputDir).toEqual(expect.any(String));
  } finally {
    process.argv = previousArguments;
  }
});

test("selects injected dependencies and configured arguments", () => {
  const browserLauncher = { launch: jest.fn() };
  const browserArgs = ["--test"];
  const fetcher = jest.fn();
  const files = { mkdir: jest.fn(), stat: jest.fn() };
  const report = jest.fn();
  const capture = jest.fn();
  const selected = createScreenshotCliOptions({
    args: ["--primary"],
    environment: {
      RADAR_SCREENSHOT_URL: "https://radar.example",
      RADAR_SCREENSHOT_DIR: "shots",
      RADAR_SCREENSHOT_MODES: "full-page",
    },
    browserLauncher,
    browserArgs,
    fetcher,
    files,
    delayMs: 0,
    report,
    capture,
  });
  expect(selected.capture).toBe(capture);
  expect(selected.captureOptions).toEqual({
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
