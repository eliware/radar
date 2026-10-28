import { expect, jest, test } from "@jest/globals";
import { createScreenshotPageCapture } from "../../../../src/frontend/responsive/screenshot/capture-page.mjs";

test("registers page errors with the collector", async () => {
  const page = {
    on: jest.fn(),
    setViewport: jest.fn(),
    goto: jest.fn(),
    waitForSelector: jest.fn(),
    evaluate: jest.fn(),
    close: jest.fn(),
  };
  const capture = jest.fn();
  const capturePage = createScreenshotPageCapture({ newPage: jest.fn().mockResolvedValue(page) });
  await capturePage.capturePage("desktop", "http://127.0.0.1", {}, 0, capture);
  expect(capture).toHaveBeenCalledWith(page);
  expect(page.on).toHaveBeenCalledWith("pageerror", expect.any(Function));
  page.on.mock.calls[0][1](new Error("page failed"));
  expect(() => capturePage.assertNoPageErrors()).toThrow("desktop: page failed");
});
