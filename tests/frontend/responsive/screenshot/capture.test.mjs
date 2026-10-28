import { expect, jest, test } from "@jest/globals";
import { captureScreenshotTargets } from "../../../../src/frontend/responsive/screenshot/capture.mjs";

test("captures and validates each requested mode for each viewport", async () => {
  const paths = [];
  const session = {
    capturePage: jest.fn(async (_name, _url, _viewport, _delay, capture) => {
      await capture({ screenshot: jest.fn(async ({ path }) => paths.push(path)) });
    }),
  };
  const files = { stat: jest.fn(async () => ({ size: 1000 })) };
  await captureScreenshotTargets(
    session,
    "/captures",
    "http://127.0.0.1",
    [
      { name: "desktop", viewport: { width: 1200 } },
      { name: "mobile", viewport: { width: 400 } },
    ],
    ["above-fold", "full-page"],
    0,
    files,
  );
  expect(session.capturePage).toHaveBeenCalledTimes(2);
  expect(paths).toEqual([
    "/captures/desktop-above-fold.png",
    "/captures/desktop-full-page.png",
    "/captures/mobile-above-fold.png",
    "/captures/mobile-full-page.png",
  ]);
  expect(files.stat).toHaveBeenCalledTimes(4);
});
