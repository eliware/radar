import { afterEach, expect, jest, test } from "@jest/globals";
import { createScreenshotBrowserSession } from "../../../../src/frontend/responsive/screenshot/browser-session.mjs";

afterEach(() => delete globalThis.document);

function setup({ pageError = false } = {}) {
  const page = {
    on: jest.fn((event, handler) => pageError && handler(new Error("page failed"))),
    setViewport: jest.fn(),
    goto: jest.fn(),
    waitForSelector: jest.fn(),
    evaluate: jest.fn((callback) => {
      globalThis.document = { fonts: { ready: Promise.resolve() } };
      return callback();
    }),
    close: jest.fn(),
  };
  const browser = { newPage: jest.fn().mockResolvedValue(page), close: jest.fn() };
  const browserLauncher = { launch: jest.fn().mockResolvedValue(browser) };
  return { page, browser, browserLauncher };
}

test("sets up, captures, and closes browser pages", async () => {
  const tools = setup();
  const session = await createScreenshotBrowserSession(tools.browserLauncher, ["--no-sandbox"]);
  const capture = jest.fn();
  await session.capturePage("desktop", "http://127.0.0.1:3000", { width: 1000 }, 0, capture);
  session.assertNoPageErrors();
  await session.close();
  expect(tools.browserLauncher.launch).toHaveBeenCalledWith({
    headless: true,
    args: ["--no-sandbox"],
  });
  expect(tools.page.goto).toHaveBeenCalledWith("http://127.0.0.1:3000", {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  expect(capture).toHaveBeenCalledWith(tools.page);
  expect(tools.page.close).toHaveBeenCalledTimes(1);
  expect(tools.browser.close).toHaveBeenCalledTimes(1);
});

test("reports browser errors and closes the page when capture fails", async () => {
  const tools = setup({ pageError: true });
  const session = await createScreenshotBrowserSession(tools.browserLauncher);
  await expect(
    session.capturePage("desktop", "http://127.0.0.1", {}, 0, () => {
      throw new Error("capture failed");
    }),
  ).rejects.toThrow("capture failed");
  expect(tools.page.close).toHaveBeenCalledTimes(1);
  expect(() => session.assertNoPageErrors()).toThrow("desktop: page failed");
  await session.close();
});

test("continues when browser font readiness is unavailable", async () => {
  const tools = setup();
  tools.page.evaluate.mockImplementation((callback) => {
    globalThis.document = {};
    return callback();
  });
  const session = await createScreenshotBrowserSession(tools.browserLauncher);
  await session.capturePage("mobile", "http://127.0.0.1", {}, 0, jest.fn());
  session.assertNoPageErrors();
  await session.close();
});
