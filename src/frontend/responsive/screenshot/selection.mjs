import { composeScreenshotOptions } from "./options.mjs";
import { parseScreenshotArguments } from "./selection/arguments.mjs";
import { readScreenshotSelectionConfiguration } from "./selection/configuration.mjs";

export function selectScreenshotOptions(args = [], environment = process.env) {
  const { primary } = parseScreenshotArguments(args);
  const { viewportSelection, modeSelection } = readScreenshotSelectionConfiguration(
    { primary },
    environment,
  );
  return composeScreenshotOptions(viewportSelection, modeSelection);
}
