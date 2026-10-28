import { createScreenshotBrowserSession } from "./browser-session.mjs";
import { captureScreenshotTargets } from "./capture.mjs";
import { finalizeScreenshotSession } from "./finalize.mjs";
import { reportScreenshotResults } from "./report.mjs";

export async function runScreenshotCapture({
  folder,
  baseUrl,
  targets,
  modes,
  browserLauncher,
  browserArgs,
  files,
  delayMs,
  report,
}) {
  const session = await createScreenshotBrowserSession(browserLauncher, browserArgs);
  await finalizeScreenshotSession(session, () =>
    captureScreenshotTargets(session, folder, baseUrl, targets, modes, delayMs, files),
  );
  return reportScreenshotResults(report, targets, modes, folder);
}
