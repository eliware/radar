import { mkdir, stat } from "node:fs/promises";
import puppeteer from "puppeteer";
import { captureResponsiveScreenshots } from "../screenshots.mjs";
import { selectScreenshotBrowserArgs } from "./browser/launch-options.mjs";
import { createScreenshotLaunchOptions } from "./launcher.mjs";

export async function runScreenshotCli({
  args = process.argv.slice(2),
  environment = process.env,
  browserLauncher = puppeteer,
  browserArgs = selectScreenshotBrowserArgs(),
  fetcher = fetch,
  files = { mkdir, stat },
  delayMs = 500,
  report = console.log,
  capture = captureResponsiveScreenshots,
} = {}) {
  return capture({
    ...createScreenshotLaunchOptions(args, environment),
    browserLauncher,
    browserArgs,
    fetcher,
    files,
    delayMs,
    report,
  });
}
