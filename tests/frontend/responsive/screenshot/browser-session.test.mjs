import { expect, jest, test } from "@jest/globals";
import { createScreenshotBrowserSession } from "../../../../src/frontend/responsive/screenshot/browser-session.mjs";

test("composes browser launch and page capture into a session", async () => {
  const page = {
    on: jest.fn(),
    setViewport: jest.fn(),
    goto: jest.fn(),
    waitForSelector: jest.fn(),
    evaluate: jest.fn(),
    close: jest.fn(),
  };
  const browser = { newPage: jest.fn().mockResolvedValue(page), close: jest.fn() };
  const browserLauncher = { launch: jest.fn().mockResolvedValue(browser) };
  const session = await createScreenshotBrowserSession(browserLauncher);
  await session.capturePage("desktop", "http://127.0.0.1", {}, 0, jest.fn());
  session.assertNoPageErrors();
  await session.close();
  expect(page.close).toHaveBeenCalledTimes(1);
  expect(browser.close).toHaveBeenCalledTimes(1);
});
