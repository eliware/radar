import { parseScreenshotArguments } from "./selection/arguments.mjs";
import { createScreenshotSelectionOptions } from "./selection/options.mjs";

export function selectScreenshotOptions(args = [], environment = process.env) {
  const { primary } = parseScreenshotArguments(args);
  return createScreenshotSelectionOptions(primary, environment);
}
