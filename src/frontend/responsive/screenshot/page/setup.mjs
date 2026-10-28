import { waitForScreenshotPageReadiness } from "./readiness.mjs";

export async function prepareScreenshotPage(page, baseUrl, viewport) {
  await page.setViewport(viewport);
  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  await waitForScreenshotPageReadiness(page);
}
