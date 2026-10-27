function positionOf(aircraft) {
  if (!Number.isFinite(aircraft.latitude) || !Number.isFinite(aircraft.longitude)) return null;
  return `${aircraft.latitude.toFixed(4)}, ${aircraft.longitude.toFixed(4)}`;
}

export function aircraftValuesOf(aircraft, now) {
  const withUnit = (value, suffix) =>
    value === null || value === undefined ? "-" : `${value}${suffix}`;
  const altitude = aircraft.altitudeFeet?.toLocaleString("en-US");
  const heading = aircraft.trackDegrees?.toString().padStart(3, "0");
  const bearing = aircraft.bearingDegrees?.toString().padStart(3, "0");
  return [
    aircraft.callsign ?? "-",
    aircraft.icao ?? "-",
    withUnit(altitude, " ft"),
    withUnit(aircraft.groundSpeedKnots, " kt"),
    withUnit(heading, "°"),
    withUnit(aircraft.verticalRateFeetPerMinute, " fpm"),
    aircraft.squawk ?? "-",
    positionOf(aircraft) ?? "-",
    withUnit(aircraft.distanceNauticalMiles, " nm"),
    withUnit(bearing, "°"),
    `${Math.max(0, Math.floor((now - aircraft.lastSeen) / 1000))}s`,
  ];
}
