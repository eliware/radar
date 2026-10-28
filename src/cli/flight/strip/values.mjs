import { formatAircraftAge } from "./age.mjs";
import { formatAircraftPosition } from "./position.mjs";

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
    formatAircraftPosition(aircraft) ?? "-",
    withUnit(aircraft.distanceNauticalMiles, " nm"),
    withUnit(bearing, "°"),
    formatAircraftAge(aircraft, now),
  ];
}
