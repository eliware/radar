export function clipProcedureSegment(from, to, range) {
  const fromInside = from.rangeNm <= range;
  const toInside = to.rangeNm <= range;
  if (fromInside && toInside) return { from: from.screen, to: to.screen };
  if (!fromInside && !toInside) return null;
  const fraction = (range - from.rangeNm) / (to.rangeNm - from.rangeNm);
  const edge = {
    x: from.screen.x + (to.screen.x - from.screen.x) * fraction,
    y: from.screen.y + (to.screen.y - from.screen.y) * fraction,
  };
  return fromInside ? { from: from.screen, to: edge } : { from: edge, to: to.screen };
}
