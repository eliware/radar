import { handleAircraftRecord } from "./record-handler.mjs";
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
      handleAircraftRecord(line, {
        parseSbsMessage: dependencies.parseSbsMessage,
        aircraftList,
        location,
        calculateAircraftRange: dependencies.calculateAircraftRange,
        onAircraft: (aircraft) => {
          for (const subscriber of subscribers) subscriber(aircraft);
        },
      });
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
