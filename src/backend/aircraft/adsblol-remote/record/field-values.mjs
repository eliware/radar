import { mapRemoteAircraftNumericFields } from "./numeric-fields.mjs";

export function mapRemoteAircraftFieldValues(item) {
  return {
    ...mapRemoteAircraftNumericFields(item),
    ...(text(item.flight) ? { callsign: text(item.flight) } : {}),
    ...(text(item.t) ? { aircraftTypeCode: text(item.t) } : {}),
    ...(text(item.squawk) ? { squawk: text(item.squawk) } : {}),
    ...(text(item.emergency) ? { emergency: text(item.emergency) } : {}),
  };
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}
