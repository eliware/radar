import { prepareScreenshotPage } from "./setup.mjs";
import { waitForScreenshotReadiness } from "./readiness.mjs";

export function createScreenshotPageSession(browser) {
  async function capturePage(baseUrl, viewport, delayMs, onPageError, capture) {
    const page = await browser.newPage();
    page.on("pageerror", onPageError);
    try {
      await prepareScreenshotPage(page, baseUrl, viewport);
      await waitForScreenshotReadiness(delayMs);
      return await capture(page);
    } finally {
      await page.close();
    }
  }

  return { capturePage };
}
