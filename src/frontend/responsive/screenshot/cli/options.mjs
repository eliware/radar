import { createScreenshotLaunchOptions } from "../launcher.mjs";

export function createScreenshotCliCaptureOptions(args, environment, dependencies) {
  return {
    ...createScreenshotLaunchOptions(args, environment),
    ...dependencies,
  };
}
