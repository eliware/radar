import { resolve } from "node:path";

export async function prepareScreenshotOutput(outputDir, files) {
  const folder = resolve(outputDir);
  await files.mkdir(folder, { recursive: true });
  return folder;
}
