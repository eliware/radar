import { afterEach, expect, jest, test } from "@jest/globals";
import { waitForScreenshotPageReadiness } from "../../../../../src/frontend/responsive/screenshot/page/readiness.mjs";

afterEach(() => jest.useRealTimers());
afterEach(() => delete globalThis.document);

test("waits for the scene canvas and document fonts", async () => {
  const page = {
    waitForSelector: jest.fn(),
    evaluate: jest.fn((callback) => {
      globalThis.document = { fonts: { ready: Promise.resolve() } };
      return callback();
    }),
  };
  await waitForScreenshotPageReadiness(page);
  expect(page.waitForSelector).toHaveBeenCalledWith("[data-scene] canvas", { timeout: 30000 });
  expect(page.evaluate).toHaveBeenCalledTimes(1);
  delete globalThis.document;
});

test("continues when the page has no font readiness promise", async () => {
  const page = {
    waitForSelector: jest.fn(),
    evaluate: jest.fn((callback) => {
      globalThis.document = {};
      return callback();
    }),
  };
  await expect(waitForScreenshotPageReadiness(page)).resolves.toBeUndefined();
  delete globalThis.document;
});
