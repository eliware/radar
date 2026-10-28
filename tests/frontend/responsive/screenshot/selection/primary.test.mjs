import { expect, test } from "@jest/globals";
import { hasPrimaryScreenshotOption } from "../../../../../src/frontend/responsive/screenshot/selection/primary.mjs";

test("detects the primary viewport option among parsed arguments", () => {
  expect(hasPrimaryScreenshotOption([{ name: "primary" }])).toBe(true);
  expect(hasPrimaryScreenshotOption([{ name: "other" }])).toBe(false);
  expect(hasPrimaryScreenshotOption([])).toBe(false);
});
