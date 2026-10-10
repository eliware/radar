const FEET_PER_NAUTICAL_MILE = 6076.12;
const EARTH_RADIUS_NAUTICAL_MILES = 3440.065;

export function projectAircraftPosition(aircraft, location, elevationFeet) {
  if (
    !aircraft ||
    !location ||
    !Number.isFinite(aircraft.latitude) ||
    !Number.isFinite(aircraft.longitude)
  ) {
    return null;
  }
  const latitude = (location.latitude * Math.PI) / 180;
  const north =
    ((aircraft.latitude - location.latitude) * Math.PI * EARTH_RADIUS_NAUTICAL_MILES) / 180;
  const east =
    ((aircraft.longitude - location.longitude) *
      Math.PI *
      EARTH_RADIUS_NAUTICAL_MILES *
      Math.cos(latitude)) /
    180;
  const altitude = Number.isFinite(aircraft.altitudeFeet)
    ? (aircraft.altitudeFeet - elevationFeet) / FEET_PER_NAUTICAL_MILE
    : 0;
  return { x: east, y: altitude, z: -north };
}
