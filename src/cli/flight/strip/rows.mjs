import { formatAircraftAge } from "./age.mjs";
import { formatAircraftPosition } from "./position.mjs";
import {
  formatAircraftStripCallsign,
  formatAircraftStripHeading,
} from "../../../shared/aircraft/strip-fields.mjs";

export function aircraftRowsOf(aircraft, now = Date.now) {
  return aircraft.map((item) => aircraftValuesOf(item, now()));
}

export function aircraftValuesOf(aircraft, now) {
  const withUnit = (value, suffix) =>
    value === null || value === undefined ? "-" : `${value}${suffix}`;
  const altitude = aircraft.altitudeFeet?.toLocaleString("en-US");
  const heading = formatAircraftStripHeading(aircraft);
  const bearing = aircraft.bearingDegrees?.toString().padStart(3, "0");
  return [
    formatAircraftStripCallsign(aircraft),
    aircraft.icao ?? "-",
    withUnit(altitude, " ft"),
    withUnit(aircraft.groundSpeedKnots, " kt"),
    heading,
    withUnit(aircraft.verticalRateFeetPerMinute, " fpm"),
    aircraft.squawk ?? "-",
    formatAircraftPosition(aircraft) ?? "-",
    withUnit(aircraft.distanceNauticalMiles, " nm"),
    withUnit(bearing, "°"),
    formatAircraftAge(aircraft, now),
  ];
}
