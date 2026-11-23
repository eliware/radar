import { default as getRadarRingSpacing } from "./spacing.mjs";

function getRadarRingRanges(range) {
  const step = getRadarRingSpacing(range) / 2;
  const count = Math.floor(range / step);
  return Array.from({ length: count }, (_, index) => (index + 1) * step);
}
export default getRadarRingRanges;
