import { mkdir, stat } from "node:fs/promises";
import puppeteer from "puppeteer";
import { captureResponsiveScreenshots } from "../../screenshots.mjs";
import { selectScreenshotBrowserArgs } from "../browser/launch-options.mjs";

export function resolveScreenshotCliDependencies({
  browserLauncher = puppeteer,
  browserArgs = selectScreenshotBrowserArgs(),
  fetcher = fetch,
  files = { mkdir, stat },
  delayMs = 500,
  report = console.log,
  capture = captureResponsiveScreenshots,
} = {}) {
  return { browserLauncher, browserArgs, fetcher, files, delayMs, report, capture };
}
