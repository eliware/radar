import { expect, jest, test } from "@jest/globals";
import { resolve } from "node:path";
import { default as setupScreenshotCapture } from "../../../../src/frontend/responsive/screenshot/setup.mjs";

test("checks server health before preparing the output directory", async () => {
  const fetcher = jest.fn().mockResolvedValue({ ok: true });
  const files = { mkdir: jest.fn() };
  await expect(
    setupScreenshotCapture({
      baseUrl: "http://127.0.0.1:1390",
      outputDir: "artifacts/shots",
      fetcher,
      files,
    }),
  ).resolves.toBe(resolve("artifacts/shots"));
  expect(fetcher).toHaveBeenCalledWith(new URL("http://127.0.0.1:1390/health"));
  expect(files.mkdir).toHaveBeenCalledWith(resolve("artifacts/shots"), { recursive: true });
});
