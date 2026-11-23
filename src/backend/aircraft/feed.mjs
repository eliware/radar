import { default as handleAircraftRecord } from "./record-handler.mjs";
import { default as calculateAircraftRange } from "../../shared/aircraft/range.mjs";
import { default as createAircraftList } from "../../shared/aircraft/list.mjs";
import { default as parseAdsbLocation } from "../../shared/adsb-location.mjs";
import { default as parseSbsMessage } from "../../shared/sbs-message.mjs";
import { default as connectSbsFeed } from "../../shared/tcp-feed.mjs";

export const aircraftFeedDependencies = {
  calculateAircraftRange,
  createAircraftList,
  parseAdsbLocation,
  parseSbsMessage,
  connectSbsFeed,
};

function createAircraftFeed({
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
export default createAircraftFeed;
