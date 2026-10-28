import { expect, jest, test } from "@jest/globals";
const defaultCapture = jest.fn();
jest.unstable_mockModule("../../../../src/frontend/responsive/screenshots.mjs", () => ({
  captureResponsiveScreenshots: defaultCapture,
}));
const { runScreenshotCli, selectScreenshotBrowserArgs } =
  await import("../../../../src/frontend/responsive/screenshot/cli.mjs");

test("selects browser flags for root and non-root processes", () => {
  expect(selectScreenshotBrowserArgs(0)).toEqual(["--no-sandbox", "--disable-setuid-sandbox"]);
  expect(selectScreenshotBrowserArgs(1000)).toEqual([]);
});

test("selects defaults and runs the screenshot capture", async () => {
  defaultCapture.mockResolvedValue({ count: 0 });
  await runScreenshotCli();
  expect(defaultCapture).toHaveBeenCalledWith(
    expect.objectContaining({
      baseUrl: "http://127.0.0.1:3000",
      outputDir: "artifacts/screenshots",
      targets: expect.any(Array),
      modes: ["above-fold", "full-page"],
      browserLauncher: expect.objectContaining({ launch: expect.any(Function) }),
      fetcher: expect.any(Function),
      files: expect.objectContaining({ mkdir: expect.any(Function), stat: expect.any(Function) }),
      delayMs: 500,
      report: console.log,
    }),
  );
});

test("passes CLI and environment selections to capture execution", async () => {
  const capture = jest.fn().mockResolvedValue({ count: 1 });
  const browserLauncher = { launch: jest.fn() };
  const fetcher = jest.fn();
  const files = { mkdir: jest.fn(), stat: jest.fn() };
  const report = jest.fn();
  await runScreenshotCli({
    args: ["--primary"],
    environment: {
      RADAR_SCREENSHOT_URL: "https://radar.example",
      RADAR_SCREENSHOT_DIR: "shots",
      RADAR_SCREENSHOT_MODES: "full-page",
    },
    browserLauncher,
    browserArgs: ["--test"],
    fetcher,
    files,
    delayMs: 0,
    report,
    capture,
  });
  expect(capture).toHaveBeenCalledWith(
    expect.objectContaining({
      baseUrl: "https://radar.example",
      outputDir: "shots",
      modes: ["full-page"],
      targets: [expect.objectContaining({ name: "desktop-primary" })],
      browserLauncher,
      browserArgs: ["--test"],
      fetcher,
      files,
      delayMs: 0,
      report,
    }),
  );
});
