import { expect, jest, test } from "@jest/globals";
import { runScreenshotCapture } from "../../../../src/frontend/responsive/screenshot/run.mjs";

test("runs screenshot capture, closes the browser, then reports its result", async () => {
  const browser = { close: jest.fn() };
  const browserLauncher = { launch: jest.fn().mockResolvedValue(browser) };
  const report = jest.fn();
  const result = await runScreenshotCapture({
    folder: "artifacts/shots",
    baseUrl: "http://127.0.0.1:3000",
    targets: [],
    modes: [],
    browserLauncher,
    files: {},
    delayMs: 0,
    report,
  });
  expect(browserLauncher.launch).toHaveBeenCalledWith({ headless: true, args: [] });
  expect(browser.close).toHaveBeenCalledTimes(1);
  expect(report).toHaveBeenCalledWith("Saved 0 screenshots to artifacts/shots");
  expect(result).toEqual({ count: 0, outputDir: "artifacts/shots" });
});
