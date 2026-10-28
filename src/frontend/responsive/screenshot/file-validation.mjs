export async function validateScreenshotFile(files, path) {
  if ((await files.stat(path)).size < 1000) throw new Error(`Screenshot is too small: ${path}`);
}
