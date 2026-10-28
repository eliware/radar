import { formatAircraftAge } from "./age.mjs";
import { formatAircraftPosition } from "./position.mjs";
import { formatAircraftStripCallsign } from "../../../shared/aircraft/strip/fields.mjs";
import { formatAircraftStripHeading } from "../../../shared/aircraft/strip/heading.mjs";

export function aircraftFieldsOf(aircraft, now) {
  const withUnit = (value, suffix) =>
    value === null || value === undefined ? "-" : `${value}${suffix}`;
  const altitude = aircraft.altitudeFeet?.toLocaleString("en-US");
  const heading = formatAircraftStripHeading(aircraft);
  const bearing = aircraft.bearingDegrees?.toString().padStart(3, "0");
  return {
    callsign: formatAircraftStripCallsign(aircraft),
    icao: aircraft.icao ?? "-",
    altitude: withUnit(altitude, " ft"),
    groundSpeed: withUnit(aircraft.groundSpeedKnots, " kt"),
    heading,
    verticalRate: withUnit(aircraft.verticalRateFeetPerMinute, " fpm"),
    squawk: aircraft.squawk ?? "-",
    position: formatAircraftPosition(aircraft) ?? "-",
    distance: withUnit(aircraft.distanceNauticalMiles, " nm"),
    bearing: withUnit(bearing, "°"),
    age: formatAircraftAge(aircraft, now),
  };
}
