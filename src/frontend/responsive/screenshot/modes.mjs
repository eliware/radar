export function selectScreenshotModes(selection = "above-fold,full-page") {
  const modes = selection.split(",").map((mode) => mode.trim());
  if (!modes.length || modes.some((mode) => !["above-fold", "full-page"].includes(mode))) {
    throw new Error(`Unknown screenshot mode: ${selection}`);
  }
  return modes;
}
