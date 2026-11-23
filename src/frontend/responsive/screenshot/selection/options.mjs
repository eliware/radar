import { default as composeScreenshotOptions } from "../options.mjs";
import { default as readScreenshotSelectionConfiguration } from "./configuration.mjs";

function createScreenshotSelectionOptions(primary, environment) {
  const { viewportSelection, modeSelection } = readScreenshotSelectionConfiguration(
    { primary },
    environment,
  );
  return composeScreenshotOptions(viewportSelection, modeSelection);
}
export default createScreenshotSelectionOptions;
