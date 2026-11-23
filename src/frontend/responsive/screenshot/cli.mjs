import { default as createScreenshotCliSetup } from "./cli/setup.mjs";

async function runScreenshotCli(options) {
  const { capture, captureOptions } = createScreenshotCliSetup(options);
  return capture(captureOptions);
}
export default runScreenshotCli;
