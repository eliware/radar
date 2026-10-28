import { selectScreenshotModes } from "./modes.mjs";
import { selectScreenshotViewports } from "./viewport-selection.mjs";

export function composeScreenshotOptions(viewportSelection, modeSelection) {
  return {
    targets: selectScreenshotViewports(viewportSelection),
    modes: selectScreenshotModes(modeSelection),
  };
}
