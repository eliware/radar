import { aircraftValuesOf } from "./values.mjs";

export function aircraftRowsOf(aircraft, now = Date.now) {
  return aircraft.map((item) => aircraftValuesOf(item, now()));
}
