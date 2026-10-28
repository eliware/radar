import { expect, test } from "@jest/globals";
import {
  isAllowedAppIcon,
  isAllowedPwaScreenshot,
} from "../../../../src/backend/static/asset/policy.mjs";

test("allows only named application icons", () => {
  expect(isAllowedAppIcon("radar-180.png")).toBe(true);
  expect(isAllowedAppIcon("radar-maskable-512.png")).toBe(true);
  expect(isAllowedAppIcon("private.png")).toBe(false);
});

test("allows only named PWA screenshots", () => {
  expect(isAllowedPwaScreenshot("radar-desktop.png")).toBe(true);
  expect(isAllowedPwaScreenshot("radar-mobile.png")).toBe(true);
  expect(isAllowedPwaScreenshot("private.png")).toBe(false);
});
