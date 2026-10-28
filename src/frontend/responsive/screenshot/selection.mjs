import { selectScreenshotViewports } from "./options.mjs";
import { selectScreenshotModes } from "./modes.mjs";
import { parseScreenshotArguments } from "./selection/arguments.mjs";
import { readScreenshotSelectionConfiguration } from "./selection/configuration.mjs";

export function selectScreenshotOptions(args = [], environment = process.env) {
  const parsedArguments = parseScreenshotArguments(args);
  const { viewportSelection, modeSelection } = readScreenshotSelectionConfiguration(
    parsedArguments,
    environment,
  );
  return {
    targets: selectScreenshotViewports(viewportSelection),
    modes: selectScreenshotModes(modeSelection),
  };
}
