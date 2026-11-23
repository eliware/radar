import { default as resolveScreenshotCliDependencies } from "./dependencies.mjs";
import { default as createScreenshotCliOptions } from "./options.mjs";

function createScreenshotCliSetup({
  args = process.argv.slice(2),
  environment = process.env,
  dependencies,
} = {}) {
  const { capture, ...captureDependencies } = resolveScreenshotCliDependencies(dependencies);
  return {
    capture,
    captureOptions: {
      ...createScreenshotCliOptions(args, environment),
      ...captureDependencies,
    },
  };
}
export default createScreenshotCliSetup;
