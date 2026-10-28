import { tagCandidates } from "./aircraft/tag/layout.mjs";
import { placementCost } from "./aircraft/tag/placement-cost.mjs";

export function layoutAircraftTags(context, aircraft, fontSize, viewportWidth, viewportHeight) {
  const lineHeight = fontSize * 1.15;
  context.font = `${fontSize}px Consolas, "Courier New", monospace`;
  const sorted = [...aircraft].sort((a, b) => a.y - b.y || a.x - b.x);
  const placed = [];
  for (const item of sorted) {
    const height = lineHeight * item.lines.length + 8;
    const lineWidths = item.lines.map((line) => context.measureText(line).width);
    const emergencyWidth = item.emergencyTag
      ? context.measureText(item.emergencyTag).width + fontSize
      : 0;
    const width = Math.max(...lineWidths) + emergencyWidth + 14;
    const candidates = tagCandidates(item, width, height);
    const rect = candidates.reduce(
      (best, candidate) => {
        const cost = placementCost(candidate, width, height, viewportWidth, viewportHeight, placed);
        return cost < best.cost ? { x: candidate.x, y: candidate.y, cost } : best;
      },
      { x: candidates[0].x, y: candidates[0].y, cost: Infinity },
    );
    placed.push({ ...rect, width, height, item });
  }
  return placed;
}
