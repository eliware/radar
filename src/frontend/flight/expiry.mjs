const AIRCRAFT_EXPIRY_MS = 120000;

export function pruneExpiredFlightAircraft(aircraft, now) {
  for (const [icao, item] of aircraft)
    if (Number.isFinite(item.lastSeen) && now - item.lastSeen > AIRCRAFT_EXPIRY_MS)
      aircraft.delete(icao);
}
