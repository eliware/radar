import { selectScreenshotViewports } from "./options.mjs";
import { selectScreenshotModes } from "./modes.mjs";
import { readScreenshotSelectionOptions } from "./selection/options.mjs";

export function selectScreenshotOptions(args = [], environment = process.env) {
  const { viewportSelection, modeSelection } = readScreenshotSelectionOptions(args, environment);
  return {
    targets: selectScreenshotViewports(viewportSelection),
    modes: selectScreenshotModes(modeSelection),
  };
}
