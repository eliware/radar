import { screenshotViewports } from "./viewports.mjs";

export const DEFAULT_SCREENSHOT_VIEWPORT_SELECTION = "all";

export function selectScreenshotViewports(selection = DEFAULT_SCREENSHOT_VIEWPORT_SELECTION) {
  const names = selection.split(",").map((name) => name.trim());
  const selected = names.includes("all")
    ? screenshotViewports
    : screenshotViewports.filter(({ name }) => names.includes(name));
  if (!selected.length) throw new Error(`Unknown viewport selection: ${selection}`);
  return selected;
}
