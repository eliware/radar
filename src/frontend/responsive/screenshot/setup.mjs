import { default as checkScreenshotHealth } from "./health.mjs";
import { default as prepareScreenshotOutput } from "./directory.mjs";

async function setupScreenshotCapture({ baseUrl, outputDir, fetcher, files }) {
  await checkScreenshotHealth(baseUrl, fetcher);
  return prepareScreenshotOutput(outputDir, files);
}
export default setupScreenshotCapture;
