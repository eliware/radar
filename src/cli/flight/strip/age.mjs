export function formatAircraftAge(aircraft, now) {
  return `${Math.max(0, Math.floor((now - aircraft.lastSeen) / 1000))}s`;
}
