import { resolve } from "node:path";

export async function captureResponsiveScreenshots({
  baseUrl,
  outputDir,
  targets,
  modes,
  browserLauncher,
  fetcher,
  files,
  delayMs,
  report,
}) {
  const health = await fetcher(new URL("/health", baseUrl));
  if (!health.ok) throw new Error(`Radar health check failed with HTTP ${health.status}`);
  const folder = resolve(outputDir);
  await files.mkdir(folder, { recursive: true });
  const browser = await browserLauncher.launch({ headless: true });
  const errors = [];
  try {
    for (const { name, viewport } of targets) {
      const page = await browser.newPage();
      page.on("pageerror", (error) => errors.push(`${name}: ${error.message}`));
      await page.setViewport(viewport);
      await page.goto(baseUrl, { waitUntil: "networkidle2", timeout: 30000 });
      await page.waitForSelector("[data-scene] canvas", { timeout: 30000 });
      await page.evaluate(() => document.fonts?.ready);
      await new Promise((done) => setTimeout(done, delayMs));
      for (const mode of modes) {
        const path = resolve(folder, `${name}-${mode}.png`);
        await page.screenshot({ path, fullPage: mode === "full-page" });
        if ((await files.stat(path)).size < 1000)
          throw new Error(`Screenshot is too small: ${path}`);
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
  if (errors.length) throw new Error(`Browser errors:\n${errors.join("\n")}`);
  report(`Saved ${targets.length * modes.length} screenshots to ${folder}`);
  return { count: targets.length * modes.length, outputDir: folder };
}
