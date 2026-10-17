export function layoutAircraftTags(context, aircraft, fontSize, viewportWidth, viewportHeight) {
  const lineHeight = fontSize * 1.15;
  context.font = `${fontSize}px monospace`;
  const sorted = [...aircraft].sort((a, b) => a.y - b.y || a.x - b.x);
  const placed = [];
  for (const item of sorted) {
    const height = lineHeight * item.lines.length + 8;
    const width = Math.max(...item.lines.map((line) => context.measureText(line).width)) + 14;
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

function tagCandidates(item, width, height) {
  const gap = 12;
  return [
    { x: item.x + gap, y: item.y - height - gap },
    { x: item.x + gap, y: item.y + gap },
    { x: item.x - width - gap, y: item.y - height - gap },
    { x: item.x - width - gap, y: item.y + gap },
    { x: item.x - width / 2, y: item.y - height - gap },
    { x: item.x - width / 2, y: item.y + gap },
  ];
}

function placementCost(rect, width, height, canvasWidth, canvasHeight, placed) {
  const outside = Math.max(0, -rect.x) + Math.max(0, -rect.y);
  const right = Math.max(0, rect.x + width - canvasWidth);
  const bottom = Math.max(0, rect.y + height - canvasHeight);
  return (outside + right + bottom) * 1000 + overlapArea(rect, width, height, placed);
}

function overlapArea(rect, width, height, placed) {
  return placed.reduce((sum, other) => {
    const overlapX = Math.max(
      0,
      Math.min(rect.x + width, other.x + other.width) - Math.max(rect.x, other.x),
    );
    const overlapY = Math.max(
      0,
      Math.min(rect.y + height, other.y + other.height) - Math.max(rect.y, other.y),
    );
    return sum + overlapX * overlapY;
  }, 0);
}
