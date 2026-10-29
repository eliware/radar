import { composeScreenshotOptions } from "../options.mjs";
import { readScreenshotSelectionConfiguration } from "./configuration.mjs";

export function createScreenshotSelectionOptions(primary, environment) {
  const { viewportSelection, modeSelection } = readScreenshotSelectionConfiguration(
    { primary },
    environment,
  );
  return composeScreenshotOptions(viewportSelection, modeSelection);
}
