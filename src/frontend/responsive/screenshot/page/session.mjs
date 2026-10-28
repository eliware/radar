import { prepareScreenshotPage } from "./setup.mjs";
import { waitForScreenshotPageReadiness } from "./readiness.mjs";
import { waitForScreenshotReadiness } from "./wait.mjs";

export function createScreenshotPageSession(browser) {
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
