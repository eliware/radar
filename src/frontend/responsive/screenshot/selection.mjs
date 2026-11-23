import { default as parseScreenshotArguments } from "./selection/arguments.mjs";
import { default as createScreenshotSelectionOptions } from "./selection/options.mjs";

function selectScreenshotOptions(args = [], environment = process.env) {
  const { primary } = parseScreenshotArguments(args);
  return createScreenshotSelectionOptions(primary, environment);
}
export default selectScreenshotOptions;
