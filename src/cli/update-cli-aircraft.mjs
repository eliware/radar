export function createCliAircraftUpdater({
  parseSbsMessage,
  aircraftList,
  location,
  calculateRange,
}) {
  return (line) => {
    const message = parseSbsMessage(line);
    if (!message?.icao) return null;
    let aircraft = aircraftList.update(message);
    const range = calculateRange(location, aircraft);
    if (range) aircraft = aircraftList.update({ icao: message.icao, ...range });
    return aircraft;
  };
}
