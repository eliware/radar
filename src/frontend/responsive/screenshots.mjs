import { createScreenshotBrowserSession } from "./screenshot/browser-session.mjs";
import { captureScreenshotTargets } from "./screenshot/capture.mjs";
import { reportScreenshotResults } from "./screenshot/report.mjs";
import { setupScreenshotCapture } from "./screenshot/setup.mjs";
import { finalizeScreenshotSession } from "./screenshot/finalize.mjs";

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
  const session = await createScreenshotBrowserSession(browserLauncher, browserArgs);
  await finalizeScreenshotSession(session, () =>
    captureScreenshotTargets(session, folder, baseUrl, targets, modes, delayMs, files),
  );
  return reportScreenshotResults(report, targets, modes, folder);
}
