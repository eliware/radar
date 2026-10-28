import { prepareScreenshotOutput } from "./screenshot/output.mjs";
import { createScreenshotBrowserSession } from "./screenshot/browser-session.mjs";
import { checkScreenshotHealth } from "./screenshot/health.mjs";
import { captureScreenshotTargets } from "./screenshot/capture.mjs";
import { reportScreenshotResults } from "./screenshot/report.mjs";

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
  await checkScreenshotHealth(baseUrl, fetcher);
  const folder = await prepareScreenshotOutput(outputDir, files);
  const session = await createScreenshotBrowserSession(browserLauncher, browserArgs);
  try {
    await captureScreenshotTargets(session, folder, baseUrl, targets, modes, delayMs, files);
  } finally {
    await session.close();
  }
  session.assertNoPageErrors();
  return reportScreenshotResults(report, targets, modes, folder);
}
