import { mkdir, stat } from "node:fs/promises";
import puppeteer from "puppeteer";
import { captureResponsiveScreenshots } from "../src/frontend/responsive-screenshots.mjs";
import {
  selectScreenshotModes,
  selectScreenshotViewports,
} from "../src/frontend/responsive-screenshots.mjs";

await captureResponsiveScreenshots({
  baseUrl: process.env.RADAR_SCREENSHOT_URL ?? "http://127.0.0.1:3000",
  outputDir: process.env.RADAR_SCREENSHOT_DIR ?? "artifacts/screenshots",
  targets: selectScreenshotViewports(process.env.RADAR_SCREENSHOT_VIEWPORTS ?? "all"),
  modes: selectScreenshotModes(process.env.RADAR_SCREENSHOT_MODES ?? "above-fold,full-page"),
  browserLauncher: puppeteer,
  fetcher: fetch,
  files: { mkdir, stat },
  delayMs: 500,
  report: console.log,
});
