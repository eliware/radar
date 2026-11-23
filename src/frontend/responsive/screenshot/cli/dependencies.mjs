import { default as createDefaultScreenshotCliDependencies } from "./defaults.mjs";

function resolveScreenshotCliDependencies(dependencies = {}) {
  const defaults = createDefaultScreenshotCliDependencies();
  return Object.fromEntries(
    Object.keys(defaults).map((key) => [
      key,
      dependencies[key] === undefined ? defaults[key] : dependencies[key],
    ]),
  );
}
export default resolveScreenshotCliDependencies;
