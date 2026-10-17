import { expect, test } from "@jest/globals";
import {
  selectScreenshotModes,
  selectScreenshotViewports,
} from "../../../src/frontend/responsive/screenshot-options.mjs";

test("selects documented desktop and phone viewports", () => {
  expect(selectScreenshotViewports()).toHaveLength(6);
  expect(selectScreenshotViewports("desktop-primary")[0].viewport).toEqual({
    width: 1280,
    height: 1024,
    deviceScaleFactor: 1,
  });
  expect(selectScreenshotViewports("desktop-1080p")[0].viewport.width).toBe(1920);
  expect(selectScreenshotViewports("iphone-12-landscape")[0].viewport.isLandscape).toBe(true);
});

test("validates viewport and screenshot mode selections", () => {
  expect(selectScreenshotModes()).toEqual(["above-fold", "full-page"]);
  expect(() => selectScreenshotViewports("unknown")).toThrow("Unknown viewport selection");
  expect(() => selectScreenshotModes("unknown")).toThrow("Unknown screenshot mode");
});
