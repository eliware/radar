export function createClippedPointOperations() {
  return { interpolate: interpolateClippedPoint, same: areClippedPointsEqual };
}

function interpolateClippedPoint(from, to, t) {
  if (t === 0) return from;
  if (t === 1) return to;
  const result = { ...from, viewportCut: true };
  for (const [key, value] of Object.entries(to))
    if (typeof value === "number" && typeof from[key] === "number")
      result[key] = from[key] + (value - from[key]) * t;
  if ("fix" in result) result.fix = "";
  if ("label" in result) result.label = false;
  return result;
}

function areClippedPointsEqual(a, b) {
  return Math.abs(a.x - b.x) < 1e-8 && Math.abs(a.z - b.z) < 1e-8;
}
