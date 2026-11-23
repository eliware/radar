import { default as selectScreenshotOptions } from "./selection.mjs";

function createScreenshotLaunchOptions(args = [], environment = process.env) {
  const selection = selectScreenshotOptions(args, environment);
  return {
    baseUrl: environment.RADAR_SCREENSHOT_URL ?? "http://127.0.0.1:1390",
    outputDir: environment.RADAR_SCREENSHOT_DIR ?? "artifacts/screenshots",
    ...selection,
  };
}
export default createScreenshotLaunchOptions;
