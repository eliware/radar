import { resolve } from "node:path";

export async function prepareScreenshotOutput(outputDir, files) {
  const folder = resolve(outputDir);
  await files.mkdir(folder, { recursive: true });
  return folder;
}

export function screenshotOutputPath(folder, name, mode) {
  return resolve(folder, `${name}-${mode}.png`);
}

export async function validateScreenshotFile(files, path) {
  if ((await files.stat(path)).size < 1000) throw new Error(`Screenshot is too small: ${path}`);
}
