const FEET_PER_NAUTICAL_MILE = 6076.12;

export function projectMapCoordinate(coordinate, location, elevationFeet = 0) {
  if (!location || !Number.isFinite(coordinate?.[0]) || !Number.isFinite(coordinate?.[1])) {
    return null;
  }
  const deltaLongitude = ((coordinate[0] - location.longitude + 540) % 360) - 180;
  return {
    x: deltaLongitude * 60 * Math.cos((location.latitude * Math.PI) / 180),
    y: -elevationFeet / FEET_PER_NAUTICAL_MILE - 0.02,
    z: -(coordinate[1] - location.latitude) * 60,
  };
}
