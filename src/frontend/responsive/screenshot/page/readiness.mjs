export async function waitForScreenshotPageReadiness(page) {
  await page.waitForSelector("[data-scene] canvas", { timeout: 30000 });
  await page.evaluate(() => document.fonts?.ready);
}
