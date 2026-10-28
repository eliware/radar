import { mkdir, stat } from "node:fs/promises";
import puppeteer from "puppeteer";
import { captureResponsiveScreenshots } from "../src/frontend/responsive/screenshots.mjs";
import { createScreenshotLaunchOptions } from "../src/frontend/responsive/screenshot/launcher.mjs";

const launchOptions = createScreenshotLaunchOptions(process.argv.slice(2), process.env);

await captureResponsiveScreenshots({
  ...launchOptions,
  browserLauncher: puppeteer,
  browserArgs: process.getuid?.() === 0 ? ["--no-sandbox", "--disable-setuid-sandbox"] : [],
  fetcher: fetch,
  files: { mkdir, stat },
  delayMs: 500,
  report: console.log,
});
