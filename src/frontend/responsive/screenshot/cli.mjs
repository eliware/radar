import { createScreenshotCliOptions } from "./cli-options.mjs";

export async function runScreenshotCli(options) {
  const { capture, captureOptions } = createScreenshotCliOptions(options);
  return capture(captureOptions);
}
