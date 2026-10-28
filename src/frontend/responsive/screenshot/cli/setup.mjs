import { resolveScreenshotCliDependencies } from "./dependencies.mjs";
import { createScreenshotLaunchOptions } from "../launcher.mjs";

export function createScreenshotCliSetup({
  args = process.argv.slice(2),
  environment = process.env,
  dependencies,
} = {}) {
  const { capture, ...captureDependencies } = resolveScreenshotCliDependencies(dependencies);
  return {
    capture,
    captureOptions: {
      ...createScreenshotLaunchOptions(args, environment),
      ...captureDependencies,
    },
  };
}
