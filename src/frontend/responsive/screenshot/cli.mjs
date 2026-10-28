import { createScreenshotCliSetup } from "./cli-setup.mjs";

export async function runScreenshotCli(options) {
  const { capture, captureOptions } = createScreenshotCliSetup(options);
  return capture(captureOptions);
}
