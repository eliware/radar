export function formatAircraftPosition(aircraft) {
  if (!Number.isFinite(aircraft.latitude) || !Number.isFinite(aircraft.longitude)) return null;
  return `${aircraft.latitude.toFixed(4)}, ${aircraft.longitude.toFixed(4)}`;
}
