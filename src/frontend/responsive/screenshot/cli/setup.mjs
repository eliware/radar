import { default as resolveScreenshotCliDependencies } from "./dependencies.mjs";
import { default as createScreenshotCliCaptureOptions } from "./capture-options.mjs";

function createScreenshotCliSetup({
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
export default createScreenshotCliSetup;
