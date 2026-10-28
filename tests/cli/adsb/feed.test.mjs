import { expect, jest, test } from "@jest/globals";
import { connectAdsbCliFeed } from "../../../src/cli/adsb/feed.mjs";

test("updates aircraft from valid feed records and forwards stream errors", () => {
  const records = [];
  const update = jest.fn((aircraft) => records.push(aircraft));
  const writeError = jest.fn();
  const connectSbsFeed = jest.fn((options) => {
    options.onLine("invalid");
    options.onLine("valid");
    options.onError(new Error("offline"));
    return { close: jest.fn() };
  });
  const aircraftList = {
    update: jest.fn((message) => ({ ...message, lastSeen: 10 })),
    list: jest.fn(),
  };

  const feed = connectAdsbCliFeed({
    connectSbsFeed,
    options: { host: "receiver", port: 30003 },
    parseSbsMessage: (line) => (line === "valid" ? { icao: "ABC123" } : null),
    aircraftList,
    location: { latitude: 43, longitude: -70 },
    calculateAircraftRange: () => null,
    output: { update },
    writeError,
  });

  expect(connectSbsFeed).toHaveBeenCalledWith(
    expect.objectContaining({ host: "receiver", port: 30003 }),
  );
  expect(aircraftList.update).toHaveBeenCalledWith({ icao: "ABC123" });
  expect(update).toHaveBeenCalledWith({ icao: "ABC123", lastSeen: 10 });
  expect(writeError).toHaveBeenCalledWith("ADS-B stream error: offline. Retrying in 2 seconds.");
  expect(feed.close).toEqual(expect.any(Function));
});
