import { expect, jest, test } from "@jest/globals";
import { startAdsbCli } from "../../../src/cli/adsb/cli.mjs";

function dependencies() {
  const values = {
    parseAdsbOptions: jest.fn(() => ({ host: "127.0.0.1", port: 30003 })),
    parseSbsMessage: jest.fn((line) => (line === "valid" ? { icao: "ABC123" } : null)),
    createAircraftList: jest.fn(() => ({
      update: jest.fn((message) => ({ ...message, lastSeen: 10 })),
      list: jest.fn(() => [{ icao: "ABC123", lastSeen: 10 }]),
    })),
    connectSbsFeed: jest.fn(() => ({ close: jest.fn() })),
    renderFlightStrips: jest.fn(() => "LIVE FLIGHT STRIPS"),
    parseAdsbLocation: jest.fn(() => ({ latitude: 43, longitude: -70 })),
    calculateAircraftRange: jest.fn(() => null),
  };
  const write = jest.fn();
  const writeError = jest.fn();
  const setExitCode = jest.fn();
  return { values, write, writeError, setExitCode };
}

test("forwards valid feed records and stream errors", () => {
  const deps = dependencies();
  const cli = startAdsbCli({
    args: [],
    write: deps.write,
    writeError: deps.writeError,
    setExitCode: deps.setExitCode,
    dependencies: deps.values,
  });
  expect(cli.table).toBe(true);
  const feedOptions = deps.values.connectSbsFeed.mock.calls[0][0];
  cli.refresh();
  feedOptions.onLine("ignored");
  feedOptions.onLine("valid");
  expect(deps.writeError).not.toHaveBeenCalled();
  feedOptions.onError(new Error("offline"));
  expect(deps.writeError).toHaveBeenCalledWith(
    "ADS-B stream error: offline. Retrying in 2 seconds.",
  );
  expect(deps.setExitCode).not.toHaveBeenCalled();
  cli.close();
});

test("selects debug mode while forwarding records from the stream", () => {
  const deps = dependencies();
  deps.values.parseAdsbOptions.mockReturnValue({ host: "127.0.0.1", port: 30003, debug: true });
  const cli = startAdsbCli({
    args: ["--debug"],
    write: deps.write,
    writeError: deps.writeError,
    setExitCode: deps.setExitCode,
    dependencies: deps.values,
  });

  expect(cli.table).toBe(false);
  deps.values.connectSbsFeed.mock.calls[0][0].onLine("valid");
});

test("adds calculated range data to the in-memory aircraft record", () => {
  const deps = dependencies();
  const aircraft = { icao: "ABC123", lastSeen: 10 };
  deps.values.calculateAircraftRange.mockReturnValue({
    distanceNauticalMiles: 1.5,
    bearingDegrees: 270,
  });
  deps.values.createAircraftList.mockReturnValue({
    update: jest.fn(() => aircraft),
    list: jest.fn(() => [{ ...aircraft, distanceNauticalMiles: 1.5, bearingDegrees: 270 }]),
  });
  startAdsbCli({
    args: [],
    write: deps.write,
    writeError: deps.writeError,
    setExitCode: deps.setExitCode,
    locationLatitude: "43",
    locationLongitude: "-70",
    dependencies: deps.values,
  });
  deps.values.connectSbsFeed.mock.calls[0][0].onLine("valid");
  expect(deps.values.calculateAircraftRange).toHaveBeenCalledWith(
    { latitude: 43, longitude: -70 },
    aircraft,
  );
  expect(deps.values.createAircraftList.mock.results[0].value.update).toHaveBeenCalledWith({
    icao: "ABC123",
    distanceNauticalMiles: 1.5,
    bearingDegrees: 270,
  });
});

test("uses home coordinates from composed ADS-B options", () => {
  const deps = dependencies();
  deps.values.parseAdsbOptions.mockReturnValue({
    host: "127.0.0.1",
    port: 30003,
    locationLatitude: "44",
    locationLongitude: "-71",
  });
  startAdsbCli({
    args: [],
    write: deps.write,
    writeError: deps.writeError,
    setExitCode: deps.setExitCode,
    dependencies: deps.values,
  });
  expect(deps.values.parseAdsbLocation).toHaveBeenCalledWith("44", "-71");
});

test("does not render records without an aircraft address", () => {
  const deps = dependencies();
  const record = { recordType: "STA", transmissionType: 1, sessionId: "2", aircraftId: "3" };
  deps.values.parseSbsMessage.mockReturnValue(record);
  startAdsbCli({
    args: [],
    write: deps.write,
    writeError: deps.writeError,
    setExitCode: deps.setExitCode,
    dependencies: deps.values,
  });
  deps.values.connectSbsFeed.mock.calls[0][0].onLine("STA,1,2,3");
  expect(deps.write).not.toHaveBeenCalled();
});
