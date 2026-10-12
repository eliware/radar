import { mkdir, stat } from "node:fs/promises";
import puppeteer from "puppeteer";
import { captureResponsiveScreenshots } from "../src/frontend/responsive-screenshots.mjs";
import {
  selectScreenshotModes,
  selectScreenshotViewports,
} from "../src/frontend/responsive-screenshots.mjs";

const args = process.argv.slice(2);
const viewportSelection = args.includes("--primary")
  ? "desktop-primary"
  : (process.env.RADAR_SCREENSHOT_VIEWPORTS ?? "all");

await captureResponsiveScreenshots({
  baseUrl: process.env.RADAR_SCREENSHOT_URL ?? "http://127.0.0.1:3000",
  outputDir: process.env.RADAR_SCREENSHOT_DIR ?? "artifacts/screenshots",
  targets: selectScreenshotViewports(viewportSelection),
  modes: selectScreenshotModes(process.env.RADAR_SCREENSHOT_MODES ?? "above-fold,full-page"),
  browserLauncher: puppeteer,
  fetcher: fetch,
  files: { mkdir, stat },
  delayMs: 500,
  report: console.log,
});
