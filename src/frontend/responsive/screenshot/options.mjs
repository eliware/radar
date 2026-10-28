import { screenshotViewports } from "./viewports.mjs";

export function selectScreenshotViewports(selection = "all") {
  const names = selection.split(",").map((name) => name.trim());
  const selected = names.includes("all")
    ? screenshotViewports
    : screenshotViewports.filter(({ name }) => names.includes(name));
  if (!selected.length) throw new Error(`Unknown viewport selection: ${selection}`);
  return selected;
}

export function selectScreenshotModes(selection = "above-fold,full-page") {
  const modes = selection.split(",").map((mode) => mode.trim());
  if (!modes.length || modes.some((mode) => !["above-fold", "full-page"].includes(mode))) {
    throw new Error(`Unknown screenshot mode: ${selection}`);
  }
  return modes;
}
