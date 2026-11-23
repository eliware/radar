import { resolve } from "node:path";

async function prepareScreenshotOutput(outputDir, files) {
  const folder = resolve(outputDir);
  await files.mkdir(folder, { recursive: true });
  return folder;
}
export default prepareScreenshotOutput;
