export function createCanvasRadarProjector(centerX, centerY, radius, range, rotation) {
  const cosine = Math.cos(rotation);
  const sine = Math.sin(rotation);
  return (point) => ({
    x: centerX + (point.x / range) * radius * cosine - (point.z / range) * radius * sine,
    y: centerY + (point.x / range) * radius * sine + (point.z / range) * radius * cosine,
  });
}
