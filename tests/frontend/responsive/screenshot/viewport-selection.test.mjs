import { expect, test } from "@jest/globals";
import {
  DEFAULT_SCREENSHOT_VIEWPORT_SELECTION,
  selectScreenshotViewports,
} from "../../../../src/frontend/responsive/screenshot/viewport-selection.mjs";

test("selects the default, named, and landscape viewports", () => {
  expect(DEFAULT_SCREENSHOT_VIEWPORT_SELECTION).toBe("all");
  expect(selectScreenshotViewports()).toHaveLength(6);
  expect(selectScreenshotViewports("desktop-1080p")[0].viewport.width).toBe(1920);
  expect(selectScreenshotViewports("iphone-12-landscape")[0].viewport.isLandscape).toBe(true);
});

test("selects desktop-primary and rejects unknown viewports", () => {
  expect(selectScreenshotViewports("desktop-primary")[0].viewport).toEqual({
    width: 1280,
    height: 1024,
    deviceScaleFactor: 1,
  });
  expect(() => selectScreenshotViewports("unknown")).toThrow("Unknown viewport selection");
});
