import { default as launchScreenshotBrowser } from "../browser.mjs";
import { default as createScreenshotPageCapture } from "../capture-page.mjs";

async function createScreenshotBrowserSession(browserLauncher, browserArgs = []) {
  const browser = await launchScreenshotBrowser(browserLauncher, browserArgs);
  const capture = createScreenshotPageCapture(browser.browser);
  return { ...capture, close: browser.close };
}
export default createScreenshotBrowserSession;
