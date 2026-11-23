import { default as prepareScreenshotPage } from "./setup.mjs";
import { default as waitForScreenshotPageReadiness } from "./readiness.mjs";
import { default as waitForScreenshotReadiness } from "./wait.mjs";

function createScreenshotPageSession(browser) {
  async function capturePage(baseUrl, viewport, delayMs, onPageError, capture) {
    const page = await browser.newPage();
    page.on("pageerror", onPageError);
    try {
      await prepareScreenshotPage(page, baseUrl, viewport);
      await waitForScreenshotPageReadiness(page);
      await waitForScreenshotReadiness(delayMs);
      return await capture(page);
    } finally {
      await page.close();
    }
  }

  return { capturePage };
}
export default createScreenshotPageSession;
