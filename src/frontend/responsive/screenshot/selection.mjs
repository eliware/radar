import { composeScreenshotOptions } from "./options.mjs";
import { readScreenshotSelectionConfiguration } from "./selection/configuration.mjs";

export function selectScreenshotOptions(args = [], environment = process.env) {
  const { viewportSelection, modeSelection } = readScreenshotSelectionConfiguration(
    args,
    environment,
  );
  return composeScreenshotOptions(viewportSelection, modeSelection);
}
