import { expect, test } from "@jest/globals";
import { screenshotViewports } from "../../../../src/frontend/responsive/screenshot/viewports.mjs";

test("defines desktop and iPhone screenshot viewports", () => {
  expect(screenshotViewports).toEqual([
    { name: "desktop-primary", viewport: { width: 1280, height: 1024, deviceScaleFactor: 1 } },
    { name: "desktop-1080p", viewport: { width: 1920, height: 1080, deviceScaleFactor: 1 } },
    { name: "desktop-1440p", viewport: { width: 2560, height: 1440, deviceScaleFactor: 1 } },
    { name: "desktop-2160p", viewport: { width: 3840, height: 2160, deviceScaleFactor: 1 } },
    {
      name: "iphone-12-portrait",
      viewport: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    },
    {
      name: "iphone-12-landscape",
      viewport: {
        width: 844,
        height: 390,
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        isLandscape: true,
      },
    },
  ]);
});
