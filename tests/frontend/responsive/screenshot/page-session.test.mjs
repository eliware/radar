import { afterEach, expect, jest, test } from "@jest/globals";
import { createScreenshotPageSession } from "../../../../src/frontend/responsive/screenshot/page-session.mjs";

afterEach(() => delete globalThis.document);

function createPage() {
  return {
    on: jest.fn(),
    setViewport: jest.fn(),
    goto: jest.fn(),
    waitForSelector: jest.fn(),
    evaluate: jest.fn((callback) => {
      globalThis.document = { fonts: { ready: Promise.resolve() } };
      return callback();
    }),
    close: jest.fn(),
  };
}

test("prepares a browser page, captures it, and closes the page", async () => {
  const page = createPage();
  const browser = { newPage: jest.fn().mockResolvedValue(page) };
  const session = createScreenshotPageSession(browser);
  const onPageError = jest.fn();
  const capture = jest.fn(() => "captured");

  await expect(
    session.capturePage("http://127.0.0.1:3000", { width: 1000 }, 0, onPageError, capture),
  ).resolves.toBe("captured");
  expect(page.on).toHaveBeenCalledWith("pageerror", onPageError);
  expect(page.setViewport).toHaveBeenCalledWith({ width: 1000 });
  expect(page.goto).toHaveBeenCalledWith("http://127.0.0.1:3000", {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  expect(page.waitForSelector).toHaveBeenCalledWith("[data-scene] canvas", { timeout: 30000 });
  expect(capture).toHaveBeenCalledWith(page);
  expect(page.close).toHaveBeenCalledTimes(1);
});

test("closes the page when capture fails and continues without font readiness", async () => {
  const page = createPage();
  page.evaluate.mockImplementation((callback) => {
    globalThis.document = {};
    return callback();
  });
  const session = createScreenshotPageSession({ newPage: jest.fn().mockResolvedValue(page) });
  await expect(
    session.capturePage("http://127.0.0.1", {}, 0, jest.fn(), () => {
      throw new Error("capture failed");
    }),
  ).rejects.toThrow("capture failed");
  expect(page.close).toHaveBeenCalledTimes(1);
});
