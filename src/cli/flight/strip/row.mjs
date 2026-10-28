import { aircraftFieldsOf } from "./values.mjs";

export function aircraftValuesOf(aircraft, now) {
  const fields = aircraftFieldsOf(aircraft, now);
  return [
    fields.callsign,
    fields.icao,
    fields.altitude,
    fields.groundSpeed,
    fields.heading,
    fields.verticalRate,
    fields.squawk,
    fields.position,
    fields.distance,
    fields.bearing,
    fields.age,
  ];
}
