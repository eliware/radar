import { retainUsefulCallsign } from "./callsign.mjs";

export function createAircraftList({ clock = Date.now, staleAfterMs = 120000 } = {}) {
  const aircraftByIcao = new Map();

  return {
    update(message) {
      const previous = aircraftByIcao.get(message.icao) ?? {};
      const omitted = Object.fromEntries(
        Object.entries(previous).filter(
          ([key]) => message[key] === null || message[key] === undefined,
        ),
      );
      const aircraft = { ...message, ...omitted, lastSeen: clock() };
      const callsign = retainUsefulCallsign(previous.callsign, message.callsign);
      if (callsign === null || callsign === undefined) delete aircraft.callsign;
      else aircraft.callsign = callsign;
      aircraftByIcao.set(message.icao, aircraft);
      return aircraft;
    },
    list() {
      const now = clock();
      for (const [icao, aircraft] of aircraftByIcao) {
        if (now - aircraft.lastSeen > staleAfterMs) aircraftByIcao.delete(icao);
      }
      return [...aircraftByIcao.values()].sort((left, right) => {
        const byDistance =
          (left.distanceNauticalMiles ?? Infinity) - (right.distanceNauticalMiles ?? Infinity);
        return byDistance || right.lastSeen - left.lastSeen;
      });
    },
  };
}
