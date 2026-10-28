export function parseElevation(value) {
  const elevation = Number(value);
  if (!Number.isFinite(elevation)) throw new Error("ADSB_ALT must be a number of feet.");
  return elevation;
}
