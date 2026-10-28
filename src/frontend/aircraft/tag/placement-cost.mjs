export function placementCost(rect, width, height, canvasWidth, canvasHeight, placed) {
  const outside = Math.max(0, -rect.x) + Math.max(0, -rect.y);
  const right = Math.max(0, rect.x + width - canvasWidth);
  const bottom = Math.max(0, rect.y + height - canvasHeight);
  const overlap = placed.reduce((sum, other) => {
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
  return (outside + right + bottom) * 1000 + overlap;
}
