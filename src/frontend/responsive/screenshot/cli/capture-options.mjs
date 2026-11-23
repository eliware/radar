import { default as createScreenshotLaunchOptions } from "../launcher.mjs";

function createScreenshotCliCaptureOptions(args, environment, dependencies) {
  return {
    ...createScreenshotLaunchOptions(args, environment),
    ...dependencies,
  };
}
export default createScreenshotCliCaptureOptions;
