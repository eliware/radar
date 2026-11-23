import { default as screenshotOutputPath } from "./path.mjs";
import { default as validateScreenshotFile } from "./file-validation.mjs";

async function captureScreenshotTargets(session, folder, baseUrl, targets, modes, delayMs, files) {
  for (const { name, viewport } of targets) {
    await session.capturePage(name, baseUrl, viewport, delayMs, async (page) => {
      for (const mode of modes) {
        const path = screenshotOutputPath(folder, name, mode);
        await page.screenshot({ path, fullPage: mode === "full-page" });
        await validateScreenshotFile(files, path);
      }
    });
  }
}
export default captureScreenshotTargets;
