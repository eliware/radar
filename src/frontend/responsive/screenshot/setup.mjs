import { checkScreenshotHealth } from "./health.mjs";
import { prepareScreenshotOutput } from "./output.mjs";

export async function setupScreenshotCapture({ baseUrl, outputDir, fetcher, files }) {
  await checkScreenshotHealth(baseUrl, fetcher);
  return prepareScreenshotOutput(outputDir, files);
}
