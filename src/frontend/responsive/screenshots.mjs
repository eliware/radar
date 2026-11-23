import { default as setupScreenshotCapture } from "./screenshot/setup.mjs";
import { default as runScreenshotCapture } from "./screenshot/run.mjs";

async function captureResponsiveScreenshots({
  baseUrl,
  outputDir,
  targets,
  modes,
  browserLauncher,
  browserArgs = [],
  fetcher,
  files,
  delayMs,
  report,
}) {
  const folder = await setupScreenshotCapture({ baseUrl, outputDir, fetcher, files });
  return runScreenshotCapture({
    folder,
    baseUrl,
    targets,
    modes,
    browserLauncher,
    browserArgs,
    files,
    delayMs,
    report,
  });
}
export default captureResponsiveScreenshots;
