const appIcons = new Set([
  "radar-180.png",
  "radar-192.png",
  "radar-512.png",
  "radar-maskable-512.png",
]);

function isAllowedAppIcon(filename) {
  return appIcons.has(filename);
}
export default isAllowedAppIcon;
