import { expect, jest, test } from "@jest/globals";
import { captureResponsiveScreenshots } from "../../../src/frontend/responsive/screenshots.mjs";
import { selectScreenshotViewports } from "../../../src/frontend/responsive/screenshot/options.mjs";

function makeCaptureTools({ size = 1000, pageError = false } = {}) {
  const page = {
    on: jest.fn((event, handler) => {
      if (pageError) handler(new Error("page failed"));
    }),
    setViewport: jest.fn(),
    goto: jest.fn(),
    waitForSelector: jest.fn(),
    evaluate: jest.fn((callback) => {
      globalThis.document = { fonts: { ready: Promise.resolve() } };
      return callback();
    }),
    screenshot: jest.fn(),
    close: jest.fn(),
  };
  const browser = { newPage: jest.fn().mockResolvedValue(page), close: jest.fn() };
  return {
    page,
    browser,
    browserLauncher: { launch: jest.fn().mockResolvedValue(browser) },
    fetcher: jest.fn().mockResolvedValue({ ok: true }),
    files: { mkdir: jest.fn(), stat: jest.fn().mockResolvedValue({ size }) },
  };
}

test("captures selected modes and checks the local server", async () => {
  const tools = makeCaptureTools();
  const report = jest.fn();
  const result = await captureResponsiveScreenshots({
    baseUrl: "http://127.0.0.1:3000",
    outputDir: "artifacts/test-shots",
    targets: selectScreenshotViewports("desktop-1080p"),
    modes: ["above-fold", "full-page"],
    browserLauncher: tools.browserLauncher,
    fetcher: tools.fetcher,
    files: tools.files,
    delayMs: 0,
    report,
  });
  expect(result.count).toBe(2);
  expect(tools.page.screenshot).toHaveBeenCalledTimes(2);
  expect(tools.page.screenshot).toHaveBeenNthCalledWith(1, {
    path: expect.stringContaining("desktop-1080p-above-fold.png"),
    fullPage: false,
  });
  expect(tools.page.screenshot).toHaveBeenNthCalledWith(2, {
    path: expect.stringContaining("desktop-1080p-full-page.png"),
    fullPage: true,
  });
  expect(tools.browser.close).toHaveBeenCalledTimes(1);
  expect(report).toHaveBeenCalledWith(expect.stringContaining("Saved 2 screenshots"));
  delete globalThis.document;
});

test("rejects an unhealthy local server", async () => {
  await expect(
    captureResponsiveScreenshots({
      baseUrl: "http://127.0.0.1:3000",
      outputDir: "artifacts/test-shots",
      targets: selectScreenshotViewports("desktop-1080p"),
      modes: ["above-fold"],
      browserLauncher: { launch: jest.fn() },
      fetcher: jest.fn().mockResolvedValue({ ok: false, status: 503 }),
      files: { mkdir: jest.fn(), stat: jest.fn() },
      delayMs: 0,
      report: jest.fn(),
    }),
  ).rejects.toThrow("Radar health check failed with HTTP 503");
});

test("rejects small screenshots and closes the browser", async () => {
  const tools = makeCaptureTools({ size: 999 });
  await expect(
    captureResponsiveScreenshots({
      baseUrl: "http://127.0.0.1:3000",
      outputDir: "artifacts/test-shots",
      targets: selectScreenshotViewports("desktop-1080p"),
      modes: ["above-fold"],
      browserLauncher: tools.browserLauncher,
      fetcher: tools.fetcher,
      files: tools.files,
      delayMs: 0,
      report: jest.fn(),
    }),
  ).rejects.toThrow("Screenshot is too small");
  expect(tools.browser.close).toHaveBeenCalledTimes(1);
  delete globalThis.document;
});

test("reports browser page errors after capture", async () => {
  const tools = makeCaptureTools({ pageError: true });
  await expect(
    captureResponsiveScreenshots({
      baseUrl: "http://127.0.0.1:3000",
      outputDir: "artifacts/test-shots",
      targets: selectScreenshotViewports("desktop-1080p"),
      modes: ["above-fold"],
      browserLauncher: tools.browserLauncher,
      fetcher: tools.fetcher,
      files: tools.files,
      delayMs: 0,
      report: jest.fn(),
    }),
  ).rejects.toThrow(/Browser errors:\s+desktop-1080p: page failed/);
  expect(tools.browser.close).toHaveBeenCalledTimes(1);
  delete globalThis.document;
});
