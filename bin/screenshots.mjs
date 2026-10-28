import { mkdir, stat } from "node:fs/promises";
import puppeteer from "puppeteer";
import { captureResponsiveScreenshots } from "../src/frontend/responsive/screenshots.mjs";
import { selectScreenshotOptions } from "../src/frontend/responsive/screenshot/selection.mjs";

const args = process.argv.slice(2);
const selection = selectScreenshotOptions(args, process.env);

await captureResponsiveScreenshots({
  baseUrl: process.env.RADAR_SCREENSHOT_URL ?? "http://127.0.0.1:3000",
  outputDir: process.env.RADAR_SCREENSHOT_DIR ?? "artifacts/screenshots",
  targets: selection.targets,
  modes: selection.modes,
  browserLauncher: puppeteer,
  browserArgs: process.getuid?.() === 0 ? ["--no-sandbox", "--disable-setuid-sandbox"] : [],
  fetcher: fetch,
  files: { mkdir, stat },
  delayMs: 500,
  report: console.log,
});
