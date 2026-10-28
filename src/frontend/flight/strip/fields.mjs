import { formatAircraftAltitude } from "../../aircraft/tag/altitude.mjs";
import { formatAircraftStripHeading } from "../../../shared/aircraft/strip/heading.mjs";
import { formatAircraftStripSpeed } from "../../../shared/aircraft/strip/speed.mjs";

export function formatAircraftStripFields(aircraft) {
  const heading = formatAircraftStripHeading(aircraft);
  const speed = formatAircraftStripSpeed(aircraft);
  const bearingAndRange =
    Number.isFinite(aircraft.distanceNauticalMiles) && Number.isFinite(aircraft.bearingDegrees)
      ? `${String(Math.round(aircraft.bearingDegrees) % 360).padStart(3, "0")}°${Math.round(aircraft.distanceNauticalMiles)}`
      : "-";
  return {
    altitude: formatAircraftAltitude(aircraft),
    aircraftType: aircraft.aircraftTypeCode || "-",
    headingAndSpeed: heading === "-" && speed === "-" ? "-" : `${heading}${speed}`,
    squawk: aircraft.squawk || "-",
    bearingAndRange,
    origin: aircraft.origin || "-",
    destination: aircraft.destination || "-",
  };
}
