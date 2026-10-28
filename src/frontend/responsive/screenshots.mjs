import { setupScreenshotCapture } from "./screenshot/setup.mjs";
import { runScreenshotCapture } from "./screenshot/run.mjs";

export async function captureResponsiveScreenshots({
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
