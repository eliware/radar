export async function prepareScreenshotPage(page, baseUrl, viewport) {
  await page.setViewport(viewport);
  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForSelector("[data-scene] canvas", { timeout: 30000 });
  await page.evaluate(() => document.fonts?.ready);
}
