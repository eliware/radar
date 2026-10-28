import { selectScreenshotViewports } from "./options.mjs";
import { selectScreenshotModes } from "./modes.mjs";
import { readScreenshotSelectionInput } from "./selection-settings.mjs";

export function selectScreenshotOptions(args = [], environment = process.env) {
  const { viewportSelection, modeSelection } = readScreenshotSelectionInput(args, environment);
  return {
    targets: selectScreenshotViewports(viewportSelection),
    modes: selectScreenshotModes(modeSelection),
  };
}
