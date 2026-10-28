import { selectScreenshotModes, selectScreenshotViewports } from "./options.mjs";
import { readScreenshotSelectionInput } from "./selection-input.mjs";

export function selectScreenshotOptions(args = [], environment = process.env) {
  const { viewportSelection, modeSelection } = readScreenshotSelectionInput(args, environment);
  return {
    targets: selectScreenshotViewports(viewportSelection),
    modes: selectScreenshotModes(modeSelection),
  };
}
