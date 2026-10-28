import { resolve } from "node:path";

export function screenshotOutputPath(folder, name, mode) {
  return resolve(folder, `${name}-${mode}.png`);
}
