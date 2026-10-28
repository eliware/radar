import {
  prepareScreenshotOutput,
  screenshotOutputPath,
  validateScreenshotFile,
} from "./screenshot/files.mjs";
import { createScreenshotBrowserSession } from "./screenshot/browser-session.mjs";

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
  const health = await fetcher(new URL("/health", baseUrl));
  if (!health.ok) throw new Error(`Radar health check failed with HTTP ${health.status}`);
  const folder = await prepareScreenshotOutput(outputDir, files);
  const session = await createScreenshotBrowserSession(browserLauncher, browserArgs);
  try {
    for (const { name, viewport } of targets) {
      await session.capturePage(name, baseUrl, viewport, delayMs, async (page) => {
        for (const mode of modes) {
          const path = screenshotOutputPath(folder, name, mode);
          await page.screenshot({ path, fullPage: mode === "full-page" });
          await validateScreenshotFile(files, path);
        }
      });
    }
  } finally {
    await session.close();
  }
  session.assertNoPageErrors();
  report(`Saved ${targets.length * modes.length} screenshots to ${folder}`);
  return { count: targets.length * modes.length, outputDir: folder };
}
