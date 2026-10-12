const EARTH_RADIUS_NM = 3440.065;

export function distanceNauticalMiles(first, second) {
  const radians = Math.PI / 180;
  const lat1 = first.latitude * radians;
  const lat2 = second.latitude * radians;
  const latDelta = lat2 - lat1;
  const lonDelta = (second.longitude - first.longitude) * radians;
  const value =
    Math.sin(latDelta / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(lonDelta / 2) ** 2;
  return 2 * EARTH_RADIUS_NM * Math.asin(Math.sqrt(Math.min(1, value)));
}
