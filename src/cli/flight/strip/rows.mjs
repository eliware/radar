import { aircraftValuesOf } from "./row.mjs";

export function aircraftRowsOf(aircraft, now = Date.now) {
  return aircraft.map((item) => aircraftValuesOf(item, now()));
}
