import { composeScreenshotOptions } from "./options.mjs";
import { parseScreenshotArguments } from "./selection/arguments.mjs";
import { hasPrimaryScreenshotOption } from "./selection/primary.mjs";
import { readScreenshotSelectionConfiguration } from "./selection/configuration.mjs";

export function selectScreenshotOptions(args = [], environment = process.env) {
  const { viewportSelection, modeSelection } = readScreenshotSelectionConfiguration(
    { primary: hasPrimaryScreenshotOption(parseScreenshotArguments(args)) },
    environment,
  );
  return composeScreenshotOptions(viewportSelection, modeSelection);
}
