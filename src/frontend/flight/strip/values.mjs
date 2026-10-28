import { formatAircraftTag } from "../../aircraft/tag-data.mjs";
import { formatAircraftSpeed } from "../../aircraft/speed.mjs";
import { formatAircraftStripHeading } from "../../../shared/aircraft/strip-fields.mjs";

export function valuesOf(aircraft) {
  const [callsign, altitude] = formatAircraftTag(aircraft);
  const speed = formatAircraftSpeed(aircraft);
  const heading = formatAircraftStripHeading(aircraft);
  const headingAndSpeed = heading === "-" && speed === "-" ? "-" : `${heading}${speed}`;
  const bearingAndRange =
    Number.isFinite(aircraft.distanceNauticalMiles) && Number.isFinite(aircraft.bearingDegrees)
      ? `${String(Math.round(aircraft.bearingDegrees) % 360).padStart(3, "0")}°${Math.round(aircraft.distanceNauticalMiles)}`
      : "-";
  return [
    callsign,
    altitude,
    aircraft.aircraftTypeCode || "-",
    headingAndSpeed,
    aircraft.squawk || "-",
    "",
    bearingAndRange,
    aircraft.origin || "-",
    aircraft.destination || "-",
  ];
}
