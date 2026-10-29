import { createAircraftTagCandidates } from "./candidates.mjs";

export function measureAircraftTag(context, item, fontSize) {
  context.font = `${fontSize}px Consolas, "Courier New", monospace`;
  const height = fontSize * 1.15 * item.lines.length + 8;
  const lineWidths = item.lines.map((line) => context.measureText(line).width);
  const emergencyWidth = item.emergencyTag
    ? context.measureText(item.emergencyTag).width + fontSize
    : 0;
  const width = Math.max(...lineWidths) + emergencyWidth + 14;
  return { width, height, candidates: createAircraftTagCandidates(item, width, height) };
}
