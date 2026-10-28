export function reportScreenshotResults(report, targets, modes, outputDir) {
  const count = targets.length * modes.length;
  report(`Saved ${count} screenshots to ${outputDir}`);
  return { count, outputDir };
}
