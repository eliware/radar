import { selectScreenshotViewports } from "./options.mjs";
import { selectScreenshotModes } from "./modes.mjs";
import { readScreenshotSelectionConfiguration } from "./selection/configuration.mjs";

export function selectScreenshotOptions(args = [], environment = process.env) {
  const { viewportSelection, modeSelection } = readScreenshotSelectionConfiguration(
    args,
    environment,
  );
  return {
    targets: selectScreenshotViewports(viewportSelection),
    modes: selectScreenshotModes(modeSelection),
  };
}
