import { mkdir, stat } from "node:fs/promises";
import puppeteer from "puppeteer";
import { default as captureResponsiveScreenshots } from "../../screenshots.mjs";
import { default as selectScreenshotBrowserArgs } from "../browser/launch-options.mjs";

function createDefaultScreenshotCliDependencies() {
  return {
    browserLauncher: puppeteer,
    browserArgs: selectScreenshotBrowserArgs(),
    fetcher: fetch,
    files: { mkdir, stat },
    delayMs: 500,
    report: console.log,
    capture: captureResponsiveScreenshots,
  };
}
export default createDefaultScreenshotCliDependencies;
