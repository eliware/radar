import { default as createScreenshotBrowserSession } from "./browser/session.mjs";
import { default as captureScreenshotTargets } from "./capture.mjs";
import { default as finalizeScreenshotSession } from "./finalize.mjs";
import { default as reportScreenshotResults } from "./report.mjs";

async function runScreenshotCapture({
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
export default runScreenshotCapture;
