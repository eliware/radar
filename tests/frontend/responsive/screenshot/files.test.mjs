import { expect, jest, test } from "@jest/globals";
import {
  prepareScreenshotOutput,
  screenshotOutputPath,
  validateScreenshotFile,
} from "../../../../src/frontend/responsive/screenshot/files.mjs";

test("creates an absolute output directory and resolves screenshot names", async () => {
  const files = { mkdir: jest.fn() };
  const folder = await prepareScreenshotOutput("artifacts/captures", files);
  expect(files.mkdir).toHaveBeenCalledWith(folder, { recursive: true });
  expect(screenshotOutputPath(folder, "desktop", "full-page")).toBe(
    `${folder}/desktop-full-page.png`,
  );
});

test("accepts valid screenshot files and rejects files below the size floor", async () => {
  const files = {
    stat: jest.fn().mockResolvedValueOnce({ size: 1000 }).mockResolvedValue({ size: 999 }),
  };
  await expect(validateScreenshotFile(files, "valid.png")).resolves.toBeUndefined();
  await expect(validateScreenshotFile(files, "small.png")).rejects.toThrow(
    "Screenshot is too small: small.png",
  );
});
