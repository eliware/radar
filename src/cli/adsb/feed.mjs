import { createCliAircraftUpdater } from "../update-cli-aircraft.mjs";

export function connectAdsbCliFeed({
  connectSbsFeed,
  options,
  parseSbsMessage,
  aircraftList,
  location,
  calculateAircraftRange,
  output,
  writeError,
}) {
  const updateAircraft = createCliAircraftUpdater({
    parseSbsMessage,
    aircraftList,
    location,
    calculateRange: calculateAircraftRange,
  });
  return connectSbsFeed({
    host: options.host,
    port: options.port,
    onLine(line) {
      const aircraft = updateAircraft(line);
      if (aircraft) output.update(aircraft);
    },
    onError(error) {
      writeError(`ADS-B stream error: ${error.message}. Retrying in 2 seconds.`);
    },
  });
}
