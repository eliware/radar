import { expect, jest, test } from "@jest/globals";
import { validateScreenshotFile } from "../../../../src/frontend/responsive/screenshot/file-validation.mjs";

test("accepts screenshot files at the minimum size", async () => {
  await expect(
    validateScreenshotFile({ stat: jest.fn().mockResolvedValue({ size: 1000 }) }, "ok.png"),
  ).resolves.toBeUndefined();
});

test("rejects screenshot files below the minimum size", async () => {
  await expect(
    validateScreenshotFile({ stat: jest.fn().mockResolvedValue({ size: 999 }) }, "small.png"),
  ).rejects.toThrow("Screenshot is too small: small.png");
});
