function createScreenshotLaunchSettings(environment) {
  return {
    baseUrl: environment.RADAR_SCREENSHOT_URL ?? "http://127.0.0.1:1390",
    outputDir: environment.RADAR_SCREENSHOT_DIR ?? "artifacts/screenshots",
  };
}
export default createScreenshotLaunchSettings;
