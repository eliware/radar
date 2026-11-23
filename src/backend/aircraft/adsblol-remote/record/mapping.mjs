import { default as mapRemoteAircraftFieldValues } from "./field-values.mjs";

function mapRemoteAircraftRecord(item, { icao, latitude, longitude, ageSeconds }, now) {
  return {
    icao,
    latitude,
    longitude,
    ...mapRemoteAircraftFieldValues(item),
    lastSeen: now - ageSeconds * 1000,
    remoteOnly: true,
  };
}
export default mapRemoteAircraftRecord;
