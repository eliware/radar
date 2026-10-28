import { launchScreenshotBrowser } from "./browser.mjs";
import { createScreenshotPageCapture } from "./capture-page.mjs";

export async function createScreenshotBrowserSession(browserLauncher, browserArgs = []) {
  const browser = await launchScreenshotBrowser(browserLauncher, browserArgs);
  const capture = createScreenshotPageCapture(browser.browser);
  return { ...capture, close: browser.close };
}
