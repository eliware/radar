import { default as createScreenshotLaunchOptions } from "../launcher.mjs";

function createScreenshotCliOptions(args, environment) {
  return createScreenshotLaunchOptions(args, environment);
}
export default createScreenshotCliOptions;
