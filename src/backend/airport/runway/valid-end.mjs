export function isValidRunwayEnd(end) {
  return (
    Number.isFinite(end.latitude) &&
    Number.isFinite(end.longitude) &&
    Number.isFinite(end.alignmentDegrees)
  );
}
