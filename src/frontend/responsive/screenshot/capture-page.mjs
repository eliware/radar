export function createScreenshotPageCapture(browser) {
  const errors = [];

  async function capturePage(name, baseUrl, viewport, delayMs, capture) {
    const page = await browser.newPage();
    page.on("pageerror", (error) => errors.push(`${name}: ${error.message}`));
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

  return {
    capturePage,
    assertNoPageErrors() {
      if (errors.length) throw new Error(`Browser errors:\n${errors.join("\n")}`);
    },
  };
}
