import { composeScreenshotOptions } from "./options.mjs";
import { parseScreenshotArguments } from "./selection/arguments.mjs";
import { readScreenshotSelectionConfiguration } from "./selection/configuration.mjs";

export function selectScreenshotOptions(args = [], environment = process.env) {
  const { viewportSelection, modeSelection } = readScreenshotSelectionConfiguration(
    parseScreenshotArguments(args),
    environment,
  );
  return composeScreenshotOptions(viewportSelection, modeSelection);
}
