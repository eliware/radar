export function clipMapSegment(start, end, range) {
  const dx = end.x - start.x;
  const dz = end.z - start.z;
  const a = dx * dx + dz * dz;
  const b = 2 * (start.x * dx + start.z * dz);
  const c = start.x * start.x + start.z * start.z - range * range;
  const discriminant = b * b - 4 * a * c;
  if (a === 0 || discriminant < 0) return null;
  const root = Math.sqrt(discriminant);
  const entry = (-b - root) / (2 * a);
  const exit = (-b + root) / (2 * a);
  if (exit < 0 || entry > 1) return null;
  const from = Math.max(0, entry);
  const to = Math.min(1, exit);
  return [interpolate(start, end, from), interpolate(start, end, to)];
}

function interpolate(start, end, amount) {
  return {
    x: start.x + (end.x - start.x) * amount,
    y: start.y + (end.y - start.y) * amount,
    z: start.z + (end.z - start.z) * amount,
  };
}
