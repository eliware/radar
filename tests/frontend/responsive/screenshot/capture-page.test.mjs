import { afterEach, expect, jest, test } from "@jest/globals";
import { createScreenshotPageCapture } from "../../../../src/frontend/responsive/screenshot/capture-page.mjs";

afterEach(() => delete globalThis.document);

function createPage({ pageError = false } = {}) {
  return {
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
}

test("prepares, captures, and closes a browser page", async () => {
  const page = createPage();
  const browser = { newPage: jest.fn().mockResolvedValue(page) };
  const capturePage = createScreenshotPageCapture(browser);
  const capture = jest.fn();
  await capturePage.capturePage("desktop", "http://127.0.0.1:3000", { width: 1000 }, 0, capture);
  capturePage.assertNoPageErrors();
  expect(page.goto).toHaveBeenCalledWith("http://127.0.0.1:3000", {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  expect(capture).toHaveBeenCalledWith(page);
  expect(page.close).toHaveBeenCalledTimes(1);
});

test("collects page errors and closes pages after capture failures", async () => {
  const page = createPage({ pageError: true });
  const capturePage = createScreenshotPageCapture({ newPage: jest.fn().mockResolvedValue(page) });
  await expect(
    capturePage.capturePage("desktop", "http://127.0.0.1", {}, 0, () => {
      throw new Error("capture failed");
    }),
  ).rejects.toThrow("capture failed");
  expect(page.close).toHaveBeenCalledTimes(1);
  expect(() => capturePage.assertNoPageErrors()).toThrow("desktop: page failed");
});

test("continues when browser font readiness is unavailable", async () => {
  const page = createPage();
  page.evaluate.mockImplementation((callback) => {
    globalThis.document = {};
    return callback();
  });
  const capturePage = createScreenshotPageCapture({ newPage: jest.fn().mockResolvedValue(page) });
  await capturePage.capturePage("mobile", "http://127.0.0.1", {}, 0, jest.fn());
  capturePage.assertNoPageErrors();
});
