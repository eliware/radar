import { calculateAircraftRange } from "../../shared/aircraft/range.mjs";
import { createAircraftList } from "../../shared/aircraft/list.mjs";
import { parseAdsbLocation } from "../../shared/adsb-location.mjs";
import { parseSbsMessage } from "../../shared/sbs-message.mjs";
import { connectSbsFeed } from "../../shared/tcp-feed.mjs";

export const aircraftFeedDependencies = {
  calculateAircraftRange,
  createAircraftList,
  parseAdsbLocation,
  parseSbsMessage,
  connectSbsFeed,
};

export function createAircraftFeed({
  host,
  port,
  locationLatitude,
  locationLongitude,
  onError = () => undefined,
  dependencies = aircraftFeedDependencies,
}) {
  const location = dependencies.parseAdsbLocation(locationLatitude, locationLongitude);
  const aircraftList = dependencies.createAircraftList();
  const subscribers = new Set();
  const connection = dependencies.connectSbsFeed({
    host,
    port,
    onError,
    onLine(line) {
      const message = dependencies.parseSbsMessage(line);
      if (!message?.icao) return;
      let aircraft = aircraftList.update(message);
      const range = dependencies.calculateAircraftRange(location, aircraft);
      if (range) aircraft = aircraftList.update({ icao: message.icao, ...range });
      for (const subscriber of subscribers) subscriber(aircraft);
    },
  });
  return {
    list: () => aircraftList.list(),
    subscribe(subscriber) {
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    },
    isReady: () => connection.isConnected(),
    close: () => connection.close(),
  };
}
