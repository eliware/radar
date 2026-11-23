function waitForScreenshotReadiness(delayMs) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}
export default waitForScreenshotReadiness;
