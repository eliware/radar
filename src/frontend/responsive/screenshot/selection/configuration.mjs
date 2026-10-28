export function readScreenshotSelectionConfiguration(args = [], environment = process.env) {
  const primary = args.includes("--primary");
  return {
    viewportSelection: primary
      ? "desktop-primary"
      : (environment.RADAR_SCREENSHOT_VIEWPORTS ?? "all"),
    modeSelection: environment.RADAR_SCREENSHOT_MODES ?? "above-fold,full-page",
  };
}
