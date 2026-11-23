import { default as selectScreenshotModes } from "./modes.mjs";
import { default as selectScreenshotViewports } from "./viewport-selection.mjs";

function composeScreenshotOptions(viewportSelection, modeSelection) {
  return {
    targets: selectScreenshotViewports(viewportSelection),
    modes: selectScreenshotModes(modeSelection),
  };
}
export default composeScreenshotOptions;
