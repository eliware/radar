import { flightStripColumns } from "./columns.mjs";

export function selectFlightStripHeaders(full) {
  return flightStripColumns.map(([longName, shortName]) => (full ? longName : shortName));
}
