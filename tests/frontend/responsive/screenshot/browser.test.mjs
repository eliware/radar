import { expect, jest, test } from "@jest/globals";
import { launchScreenshotBrowser } from "../../../../src/frontend/responsive/screenshot/browser.mjs";

test("launches and closes the headless screenshot browser", async () => {
  const browser = { close: jest.fn() };
  const browserLauncher = { launch: jest.fn().mockResolvedValue(browser) };
  const session = await launchScreenshotBrowser(browserLauncher, ["--no-sandbox"]);
  expect(browserLauncher.launch).toHaveBeenCalledWith({ headless: true, args: ["--no-sandbox"] });
  expect(session.browser).toBe(browser);
  await session.close();
  expect(browser.close).toHaveBeenCalledTimes(1);
});

test("uses empty browser arguments by default", async () => {
  const browserLauncher = { launch: jest.fn().mockResolvedValue({ close: jest.fn() }) };
  await launchScreenshotBrowser(browserLauncher);
  expect(browserLauncher.launch).toHaveBeenCalledWith({ headless: true, args: [] });
});
