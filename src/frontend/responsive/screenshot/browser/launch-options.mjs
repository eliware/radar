export function selectScreenshotBrowserArgs(uid = process.getuid?.()) {
  return uid === 0 ? ["--no-sandbox", "--disable-setuid-sandbox"] : [];
}
