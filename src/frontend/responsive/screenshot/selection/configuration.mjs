export function readScreenshotSelectionConfiguration(
  { primary = false } = {},
  environment = process.env,
) {
  return {
    viewportSelection: primary
      ? "desktop-primary"
      : (environment.RADAR_SCREENSHOT_VIEWPORTS ?? "all"),
    modeSelection: environment.RADAR_SCREENSHOT_MODES ?? "above-fold,full-page",
  };
}
