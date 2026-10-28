const appIcons = new Set([
  "radar-180.png",
  "radar-192.png",
  "radar-512.png",
  "radar-maskable-512.png",
]);
const pwaScreenshots = new Set(["radar-desktop.png", "radar-mobile.png"]);

export function isAllowedAppIcon(filename) {
  return appIcons.has(filename);
}

export function isAllowedPwaScreenshot(filename) {
  return pwaScreenshots.has(filename);
}
