import { prepareScreenshotPage } from "./setup.mjs";

export function createScreenshotPageSession(browser) {
  async function capturePage(baseUrl, viewport, delayMs, onPageError, capture) {
    const page = await browser.newPage();
    page.on("pageerror", onPageError);
    try {
      await prepareScreenshotPage(page, baseUrl, viewport);
      await new Promise((done) => setTimeout(done, delayMs));
      return await capture(page);
    } finally {
      await page.close();
    }
  }

  return { capturePage };
}
