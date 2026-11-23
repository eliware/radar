import { default as selectScreenshotOptions } from "./selection.mjs";
import { default as createScreenshotLaunchSettings } from "./launch-settings.mjs";

function createScreenshotLaunchOptions(args = [], environment = process.env) {
  return {
    ...createScreenshotLaunchSettings(environment),
    ...selectScreenshotOptions(args, environment),
  };
}
export default createScreenshotLaunchOptions;
