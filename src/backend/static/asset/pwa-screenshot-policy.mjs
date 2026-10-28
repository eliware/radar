const pwaScreenshots = new Set(["radar-desktop.png", "radar-mobile.png"]);

export function isAllowedPwaScreenshot(filename) {
  return pwaScreenshots.has(filename);
}
