export function selectScaleDistance(range, radius, maxLength) {
  const maxDistance = Math.min(range, (maxLength * range) / radius);
  let selected = 1;
  for (let exponent = 0; exponent <= 3; exponent += 1) {
    for (const factor of [1, 2, 5]) {
      const candidate = factor * 10 ** exponent;
      if (candidate <= maxDistance) selected = candidate;
    }
  }
  return selected;
}
