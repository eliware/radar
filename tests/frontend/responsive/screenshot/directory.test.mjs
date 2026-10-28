import { expect, jest, test } from "@jest/globals";
import { prepareScreenshotOutput } from "../../../../src/frontend/responsive/screenshot/directory.mjs";

test("creates an absolute screenshot output directory", async () => {
  const files = { mkdir: jest.fn() };
  const folder = await prepareScreenshotOutput("artifacts/captures", files);
  expect(files.mkdir).toHaveBeenCalledWith(folder, { recursive: true });
  expect(folder).toMatch(/artifacts[\\/]captures$/);
});
