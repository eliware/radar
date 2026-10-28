import { afterEach, expect, jest, test } from "@jest/globals";
import { prepareScreenshotPage } from "../../../../../src/frontend/responsive/screenshot/page/setup.mjs";

afterEach(() => delete globalThis.document);

test("sets the viewport and navigates to the screenshot page", async () => {
  const page = {
    setViewport: jest.fn(),
    goto: jest.fn(),
    waitForSelector: jest.fn(),
    evaluate: jest.fn((callback) => {
      globalThis.document = { fonts: { ready: Promise.resolve() } };
      return callback();
    }),
  };

  await prepareScreenshotPage(page, "http://127.0.0.1:3000", { width: 1000 });

  expect(page.setViewport).toHaveBeenCalledWith({ width: 1000 });
  expect(page.goto).toHaveBeenCalledWith("http://127.0.0.1:3000", {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
});
