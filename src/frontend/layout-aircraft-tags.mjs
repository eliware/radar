import { measureAircraftTag } from "./aircraft/tag/measure.mjs";
import { placementCost } from "./aircraft/tag/placement-cost.mjs";

export function layoutAircraftTags(context, aircraft, fontSize, viewportWidth, viewportHeight) {
  const sorted = [...aircraft].sort((a, b) => a.y - b.y || a.x - b.x);
  const placed = [];
  for (const item of sorted) {
    const { width, height, candidates } = measureAircraftTag(context, item, fontSize);
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
