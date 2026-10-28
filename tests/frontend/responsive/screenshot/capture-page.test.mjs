import { expect, jest, test } from "@jest/globals";
import { createScreenshotPageCapture } from "../../../../src/frontend/responsive/screenshot/capture-page.mjs";

test("collects named browser page errors for final assertion", async () => {
  const page = {
    on: jest.fn((_event, handler) => handler(new Error("page failed"))),
    setViewport: jest.fn(),
    goto: jest.fn(),
    waitForSelector: jest.fn(),
    evaluate: jest.fn(),
    close: jest.fn(),
  };
  const capturePage = createScreenshotPageCapture({ newPage: jest.fn().mockResolvedValue(page) });
  await capturePage.capturePage("desktop", "http://127.0.0.1", {}, 0, jest.fn());
  expect(() => capturePage.assertNoPageErrors()).toThrow("desktop: page failed");
});
