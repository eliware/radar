import { resolveScreenshotCliDependencies } from "./dependencies.mjs";
import { createScreenshotCliCaptureOptions } from "./options.mjs";

export function createScreenshotCliSetup({
  args = process.argv.slice(2),
  environment = process.env,
  dependencies,
} = {}) {
  const { capture, ...captureDependencies } = resolveScreenshotCliDependencies(dependencies);
  return {
    capture,
    captureOptions: createScreenshotCliCaptureOptions(args, environment, captureDependencies),
  };
}
