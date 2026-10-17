export function drawRadarScale(context, range, radius, height) {
  const scaleNm = selectScaleDistance(range, radius, 120);
  const length = (scaleNm / range) * radius;
  const x = 14;
  const y = height - 17;
  context.fillText(`${scaleNm} NM`, x, height - 34);
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + length, y);
  context.moveTo(x, y - 4);
  context.lineTo(x, y + 4);
  context.moveTo(x + length, y - 4);
  context.lineTo(x + length, y + 4);
  context.stroke();
}

export function selectScaleDistance(range, radius, maxLength) {
  const maxDistance = (maxLength * range) / radius;
  let selected = 1;
  for (let exponent = 0; exponent <= 3; exponent += 1) {
    for (const factor of [1, 2, 5]) {
      const candidate = factor * 10 ** exponent;
      if (candidate <= maxDistance) selected = candidate;
    }
  }
  return selected;
}
