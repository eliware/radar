import { selectScreenshotModes, selectScreenshotViewports } from "./options.mjs";

export function selectScreenshotOptions(args = [], environment = process.env) {
  const viewportSelection = args.includes("--primary")
    ? "desktop-primary"
    : (environment.RADAR_SCREENSHOT_VIEWPORTS ?? "all");
  const modeSelection = environment.RADAR_SCREENSHOT_MODES ?? "above-fold,full-page";
  return {
    targets: selectScreenshotViewports(viewportSelection),
    modes: selectScreenshotModes(modeSelection),
  };
}
