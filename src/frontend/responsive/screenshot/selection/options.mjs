import { default as readScreenshotSelectionConfiguration } from "./configuration.mjs";
import { default as selectScreenshotModes } from "../modes.mjs";
import { default as selectScreenshotViewports } from "../viewport-selection.mjs";

function createScreenshotSelectionOptions(primary, environment) {
  const { viewportSelection, modeSelection } = readScreenshotSelectionConfiguration(
    { primary },
    environment,
  );
  return {
    targets: selectScreenshotViewports(viewportSelection),
    modes: selectScreenshotModes(modeSelection),
  };
}
export default createScreenshotSelectionOptions;
