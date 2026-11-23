const pwaScreenshots = new Set(["radar-desktop.png", "radar-mobile.png"]);

function isAllowedPwaScreenshot(filename) {
  return pwaScreenshots.has(filename);
}
export default isAllowedPwaScreenshot;
