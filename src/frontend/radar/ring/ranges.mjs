import { getRadarRingSpacing } from "./spacing.mjs";

export function getRadarRingRanges(range) {
  const step = getRadarRingSpacing(range) / 2;
  const count = Math.floor(range / step);
  return Array.from({ length: count }, (_, index) => (index + 1) * step);
}
