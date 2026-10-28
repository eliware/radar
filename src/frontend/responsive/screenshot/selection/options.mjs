export function readScreenshotSelectionOptions(args = [], environment = process.env) {
  return {
    viewportSelection: args.includes("--primary")
      ? "desktop-primary"
      : (environment.RADAR_SCREENSHOT_VIEWPORTS ?? "all"),
    modeSelection: environment.RADAR_SCREENSHOT_MODES ?? "above-fold,full-page",
  };
}
