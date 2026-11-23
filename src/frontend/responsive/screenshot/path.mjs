import { resolve } from "node:path";

function screenshotOutputPath(folder, name, mode) {
  return resolve(folder, `${name}-${mode}.png`);
}
export default screenshotOutputPath;
