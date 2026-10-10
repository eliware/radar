const earthRadiusNauticalMiles = 3440.065;
const radians = (degrees) => (degrees * Math.PI) / 180;

export function calculateAircraftRange(origin, aircraft) {
  if (!origin || !Number.isFinite(aircraft.latitude) || !Number.isFinite(aircraft.longitude)) {
    return null;
  }
  const lat1 = radians(origin.latitude);
  const lat2 = radians(aircraft.latitude);
  const deltaLat = lat2 - lat1;
  const deltaLon = radians(aircraft.longitude - origin.longitude);
  const haversine =
    Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
  const boundedHaversine = Math.min(1, Math.max(0, haversine));
  const distance =
    2 *
    earthRadiusNauticalMiles *
    Math.atan2(Math.sqrt(boundedHaversine), Math.sqrt(1 - boundedHaversine));
  const y = Math.sin(deltaLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
  const bearing = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  return {
    distanceNauticalMiles: Number(distance.toFixed(1)),
    bearingDegrees: Math.round(bearing) % 360,
  };
}
