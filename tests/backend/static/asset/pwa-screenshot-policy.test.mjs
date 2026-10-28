import { expect, test } from "@jest/globals";
import { isAllowedPwaScreenshot } from "../../../../src/backend/static/asset/pwa-screenshot-policy.mjs";

test("allows only named PWA screenshots", () => {
  expect(isAllowedPwaScreenshot("radar-desktop.png")).toBe(true);
  expect(isAllowedPwaScreenshot("radar-mobile.png")).toBe(true);
  expect(isAllowedPwaScreenshot("private.png")).toBe(false);
});
