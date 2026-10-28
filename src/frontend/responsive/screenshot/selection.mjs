import { selectScreenshotViewports } from "./options.mjs";
import { selectScreenshotModes } from "./modes.mjs";
import { parseScreenshotArguments } from "./arguments.mjs";
import { readScreenshotSelectionOptions } from "./selection/options.mjs";

export function selectScreenshotOptions(args = [], environment = process.env) {
  const parsedArguments = parseScreenshotArguments(args);
  const { viewportSelection, modeSelection } = readScreenshotSelectionOptions(
    parsedArguments,
    environment,
  );
  return {
    targets: selectScreenshotViewports(viewportSelection),
    modes: selectScreenshotModes(modeSelection),
  };
}
