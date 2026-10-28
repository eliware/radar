import { prepareScreenshotOutput } from "./screenshot/output.mjs";
import { createScreenshotBrowserSession } from "./screenshot/browser-session.mjs";
import { checkScreenshotHealth } from "./screenshot/health.mjs";
import { captureScreenshotTargets } from "./screenshot/capture.mjs";

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
  report(`Saved ${targets.length * modes.length} screenshots to ${folder}`);
  return { count: targets.length * modes.length, outputDir: folder };
}
