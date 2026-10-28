export function createScreenshotPageSession(browser) {
  async function capturePage(baseUrl, viewport, delayMs, onPageError, capture) {
    const page = await browser.newPage();
    page.on("pageerror", onPageError);
    try {
      await page.setViewport(viewport);
      await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForSelector("[data-scene] canvas", { timeout: 30000 });
      await page.evaluate(() => document.fonts?.ready);
      await new Promise((done) => setTimeout(done, delayMs));
      return await capture(page);
    } finally {
      await page.close();
    }
  }

  return { capturePage };
}
