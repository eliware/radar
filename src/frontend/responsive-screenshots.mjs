import { resolve } from "node:path";
import { KnownDevices } from "puppeteer";

const iphone = KnownDevices["iPhone 12"];
const viewports = [
  { name: "desktop-1080p", viewport: { width: 1920, height: 1080, deviceScaleFactor: 1 } },
  { name: "desktop-1440p", viewport: { width: 2560, height: 1440, deviceScaleFactor: 1 } },
  { name: "desktop-2160p", viewport: { width: 3840, height: 2160, deviceScaleFactor: 1 } },
  { name: "iphone-12-portrait", viewport: iphone.viewport },
  {
    name: "iphone-12-landscape",
    viewport: {
      ...iphone.viewport,
      width: iphone.viewport.height,
      height: iphone.viewport.width,
      isLandscape: true,
    },
  },
];

export function selectScreenshotViewports(selection = "all") {
  const names = selection.split(",").map((name) => name.trim());
  const selected = names.includes("all")
    ? viewports
    : viewports.filter(({ name }) => names.includes(name));
  if (!selected.length) throw new Error(`Unknown viewport selection: ${selection}`);
  return selected;
}

export function selectScreenshotModes(selection = "above-fold,full-page") {
  const modes = selection.split(",").map((mode) => mode.trim());
  if (!modes.length || modes.some((mode) => !["above-fold", "full-page"].includes(mode))) {
    throw new Error(`Unknown screenshot mode: ${selection}`);
  }
  return modes;
}

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
