export function handleAircraftRecord(
  line,
  { parseSbsMessage, aircraftList, location, calculateAircraftRange, onAircraft },
) {
  const message = parseSbsMessage(line);
  if (!message?.icao) return;
  let aircraft = aircraftList.update(message);
  const range = calculateAircraftRange(location, aircraft);
  if (range) aircraft = aircraftList.update({ icao: message.icao, ...range });
  onAircraft(aircraft);
}
