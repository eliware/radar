import { expect, test } from "@jest/globals";
import { isAllowedAppIcon } from "../../../../src/backend/static/asset/policy.mjs";

test("allows only named application icons", () => {
  expect(isAllowedAppIcon("radar-180.png")).toBe(true);
  expect(isAllowedAppIcon("radar-maskable-512.png")).toBe(true);
  expect(isAllowedAppIcon("private.png")).toBe(false);
});
